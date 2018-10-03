/* global Nightmare, describe, it, before, after */
const chai = require('chai');

const expect = chai.expect;
module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-audit:', function startTest() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    this.timeout(Number(config.test_timeout));

    describe('Login > navigate to app > verify message > logout', () => {
      const testRunYear = new Date().getFullYear();
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app and search for login user ', (done) => {
        nightmare
          .wait('#clickable-audit-module')
          .click('#clickable-audit-module')
          .wait('#input-audit-search')
          .click('#input-audit-search')
          .insert('#input-audit-search', config.username)
          .wait('#clickable-list-column-timestamp')
          .click('#paneHeaderpane-results-subtitle')
          .evaluate(() => { return document.querySelector('#list-audit') ? 1 : 0; })
          .then((result) => {
            if (result) {
              nightmare
                .wait('#list-audit div[class*=scrollable] div div div')
                .click('#list-audit div[class*=scrollable] div div div a')
                .click('#audit-module-display div section:nth-child(4) :last-child')
                .then(done)
                .catch(done);
            }
          })
          .catch(error => {
            throw new Error(`Error search on target id with ${config.username}`, error);
          }, done);
      });
      it('should change filter index between all the HTTP methods ', (done) => {
        nightmare
          .wait('#clickable-audit-module')
          .click('#clickable-audit-module')
          .wait('#clickable-filter-method-POST')
          .click('#clickable-filter-method-POST')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-POST')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-PUT')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-PUT')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-DELETE')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-DELETE')
          .wait('#clickable-list-column-timestamp')
          .click('#clickable-filter-method-PATCH')
          .wait('div[class*="noResultsMessage"]')
          .evaluate(() => document.querySelector('div[class*="noResultsMessage"]').innerText.trim())
          .then((result) => {
            expect(result).to.equal(`No results found for "${config.username}". Please check your spelling and filters.`);
            done();
          })
          .catch(done);
      });
      it('should change search index to timestamp ', (done) => {
        nightmare
          .wait('#clickable-audit-module')
          .click('#clickable-audit-module')
          .click('#clickable-reset-all')
          .wait('#input-audit-search-qindex')
          .click('#input-audit-search-qindex')
          .type('#input-audit-search-qindex', 'time')
          .insert('#input-audit-search', testRunYear)
          .wait('#clickable-list-column-timestamp')
          .then(done)
          .catch(done);
      });
      it('should change filter index for HTTP statuses ', (done) => {
        nightmare
          .check('input[id$="201"]')
          .wait('#clickable-list-column-timestamp')
          .uncheck('input[id$="201"]')
          .check('input[id$="204"]')
          .wait('#clickable-list-column-timestamp')
          .uncheck('input[id$="204"]')
          .check('input[id$="403"]')
          .wait('#clickable-list-column-timestamp')
          .uncheck('input[id$="403"]')
          .check('input[id$="400"]')
          .wait('#clickable-list-column-timestamp')
          .uncheck('input[id$="400"]')
          .check('input[id$="500"]')
          .wait('#clickable-list-column-timestamp')
          .uncheck('input[id$="500"]')
          .then(done)
          .catch(done);
      });
    });
  });
};
