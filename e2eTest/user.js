module.exports = {
  'Demo test User' : function (browser) {
    browser
      .url('http://localhost:8081')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('button[name=getStarted]', 1000)
      .click('button[name=getStarted]')
      .pause(1000)
      .setValue('input[type=email]', 'temitope.emmanuel@andela.com')
      .pause(1000)
      .setValue('input[type=password]', 'silver')
      .pause(1000)
      .click('button[name=signin]')
      .pause(1000)
      .url('http://localhost:8081/single/2')
      .pause(1000)
      .waitForElementVisible('button[name=borrow]', 1000)
      .pause(1000)
      .click('button[name=borrow]')
      .pause(1000)
      .waitForElementVisible('button[name=return]', 1000)
      .pause(1000)
      .click('button[name=return]')
      .pause(1000)
      .click('a[href="/read-book/2"]')
      .pause(1000)
      .waitForElementVisible('i.material-icons', 1000)
      .click('i.material-icons')
      .pause(1000)
      .waitForElementVisible('i.material-icons', 1000)
      .pause(1000)
      .click('a[name=history]')
      .pause(1000)
      .click('body')
      .pause(1000)
      .click('i.material-icons')
      .pause(1000)
      .click('a[name=settings]')
      .pause(1000)
      .click('body')
      .pause(1000)
      .click('i.material-icons')
      .pause(1000)
      .click('a[name=notifications]')
      .pause(1000)
      .waitForElementVisible('a[name=signout]', 1000)
      .click('a[name=signout]')
      .pause(3000)
      .end();
  }
};