/// <reference types="cypress" />

import { getUniqueId } from "../support/uniqueIdGenerator"

describe('Test with backend', () => {
	beforeEach('login to the app', () => {
		cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })
		cy.loginToApplication()
	})

	it('should log in', () => {
		cy.log('logged in')
	})

	it('verify correct request and response', () => {
		cy.intercept('POST', 'https://api.realworld.io/api/articles').as('postArticles')

		cy.contains('New Article').click()
		cy.get('[formcontrolname="title"]').type('This is the title' + getUniqueId())
		cy.get('[formcontrolname="description"]').type('This is the description')
		cy.get('[formcontrolname="body"]').type('This is the body')
		cy.contains('Publish Article').click()

		cy.wait('@postArticles').then(xhr => {
			console.log(xhr)
			expect(xhr.response.statusCode).to.equal(201)
			expect(xhr.response.body.article.body).to.equal('This is the body')
			expect(xhr.response.body.article.description).to.equal('This is the description')
		})
	})

	it('verify popular tags are displayed', () => { //tags provided by us in line 5
		cy.get('.tag-list')
			.should('contain', 'cypress')
			.and('contain', 'automation')
			.and('contain', 'testing')
	})

	it('verify global feed likes count', () => {
		cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', { "articles": [], "articlesCount": 0 })
		cy.intercept('GET', 'https://api.realworld.io/api/articles*', { fixture: 'articles.json' })

		cy.contains('Global Feed').click()
		cy.get('app-article-list button').then(heartList => {
			expect(heartList[0]).to.contain('1')
			expect(heartList[1]).to.contain('5')
		})

		cy.fixture('articles').then(file => {
			const articleLink = file.articles[1].slug
			file.articles[1].favoritesCount = 6
			cy.intercept('POST', `https://api.realworld.io/api/articles/${articleLink}/favorite`, file)
		})

		cy.get('app-article-list button').eq(1).click().should('contain', '6')
	})


	it('intercepting and modifying the request and response', () => {
		// cy.intercept('POST', '**/articles', (req) => {
		// 	req.body.article.description = 'This is intercepted description'
		// }).as('postArticles')

		cy.intercept('POST', '**/articles', (req) => {
			req.reply(res => {
				expect(res.body.article.description).to.equal('This is the description')
				res.body.article.description = 'This is intercepted description'
			})
		}).as('postArticles')

		cy.contains('New Article').click()
		cy.get('[formcontrolname="title"]').type('This is the title' + getUniqueId())
		cy.get('[formcontrolname="description"]').type('This is the description')
		cy.get('[formcontrolname="body"]').type('This is the body')
		cy.contains('Publish Article').click()

		cy.wait('@postArticles').then(xhr => {
			console.log(xhr)
			expect(xhr.response.statusCode).to.equal(201)
			expect(xhr.response.body.article.body).to.equal('This is the body')
			expect(xhr.response.body.article.description).to.equal('This is intercepted description')
		})
	})

	it('delete a new article in a global feed', () => {
		const bodyRequest = {
			"article": {
				"title": "Request from API" + getUniqueId(),
				"description": "API testing is easy",
				"body": "Angular is cool",
				"tagList": []
			}
		}

		cy.get('@token')
			.then(token => {

				cy.request({
					url: 'https://api.realworld.io/api/articles/',
					headers: { 'Authorization': `Token ${token}` },
					method: 'POST',
					body: bodyRequest
				}).then(response => {
					expect(response.status).to.equal(201)
				})

				cy.intercept('GET', 'https://api.realworld.io/api/articles*').as('getArticleList')
				cy.contains('Global Feed').click();
				cy.wait('@getArticleList')
				cy.get('.article-preview').first().click()
				cy.get('.article-actions').contains('Delete Article').click()

				cy.request({
					url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
					headers: { 'Authorization': `Token ${token}` },
					method: 'GET',
				}).its('body').then(responseBody => {
					expect(responseBody.articles[0].title).not.to.equal(bodyRequest.article.title)
				})
			})
	})
})
