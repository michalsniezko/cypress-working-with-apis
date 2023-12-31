/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// noinspection JSCheckFunctionSignatures
/**
 * @memberof cy
 * @method loginToApplication
 * @param {*} [value]
 * @returns Chainable
 */
Cypress.Commands.add('loginToApplication', () => {
    const userCredentials = {
        "user": {
            "email": Cypress.env('username'),
            "password": Cypress.env('password')
        }
    }

    cy.request('POST', `${Cypress.env('apiUrl')}/api/users/login`, userCredentials)
        .its('body') // cy.request yields a 'response' object and then its('body') gets a property 'body' on 'response' object
        .then(responseBody => {
            const token = responseBody.user.token

            cy.wrap(token).as('token') //save for other test

            cy.visit('/', {
                onBeforeLoad(windowObject) {
                    windowObject.localStorage.setItem('jwtToken', token)
                }
            })
        })

    // cy.visit('/login')
    // cy.get('[placeholder="Email"]').type('artem.bondar16@gmail.com')
    // cy.get('[placeholder="Password"]').type('CypressTest1')
    // cy.get('form').submit()
})
