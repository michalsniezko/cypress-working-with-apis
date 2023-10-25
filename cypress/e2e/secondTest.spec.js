describe('Test log out', () => {
    beforeEach('login to the app', () => {
        cy.loginToApplication()
    })

    it('verify user can log out succesfully', () => {
        cy.contains('Settings').click()
        cy.get('button').contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})