const data = require("./data/credentials")
const pup = require("puppeteer");
const credentials = require("./data/credentials");

module.exports = {
    run : async() => {
        try{
            const waitfor = t => new Promise(resolve => setTimeout(resolve, t)); 
            const browser = pup.launch({
                headless: false,  //false means browser is going to visible
                defaultViewport: false
            });
            let br = await browser
			let tab = await br.newPage();
            await tab.goto("https://www.linkedin.com/login")
            await tab.click("input[id = 'username']");
            await tab.type("input[id = 'username']", data.email);
            await tab.click("input[id = 'password']")
            await tab.type("input[id = 'password']", data.password)
            await tab.click('.btn__primary--large')

            await tab.waitForSelector('.search-global-typeahead__input.always-show-placeholder')
            await tab.click('.search-global-typeahead__input.always-show-placeholder')
            await tab.type('.search-global-typeahead__input.always-show-placeholder', "Microsoft");
            await tab.keyboard.press("Enter");

            await tab.waitForSelector(".entity-result__title-text.entity-result__title-text--overflowed.t-16")
            await tab.click('.entity-result__title-text.entity-result__title-text--overflowed.t-16')
            await tab.waitForSelector(".t-16.t-bold.t-black--light.org-page-navigation__item-anchor.ember-view.pv3.ph4")
            let tabs = await tab.$$('.t-16.t-bold.t-black--light.org-page-navigation__item-anchor.ember-view.pv3.ph4');
            await tabs[5].click();
            await tab.waitForSelector(".org-people-profiles-module__profile-item");

            let hrefs = [];
            while(hrefs.length <= 10){
                await tab.evaluate(_ => {
                    window.scrollBy(0, (window.innerHeight + window.pageYOffset + 1050))
                });
                await waitfor(2000);
                let profiles = await tab.$$('.org-people-profiles-module__profile-item');
                profiles = profiles.slice(6);
                for(let profile of profiles){
                    hrefs.push(await tab.evaluate(e => {
                        return e.querySelector('.artdeco-entity-lockup__title.ember-view a') === null ? 'null':
                        e.querySelector('.artdeco-entity-lockup__title.ember-view a').getAttribute("href");
    
                    }, profile))
                }
                hrefs = hrefs.filter(h => h !== 'null');
            }
            idx = 0;
            for(let href of hrefs){
                if(idx == 5){
                    break;
                }
                await tab.goto("https://www.linkedin.com" + href);
            
                    await tab.waitForSelector('.ml2.mr2')
                    await tab.click('.ml2.mr2')
                    await tab.waitForSelector('.artdeco-dropdown__content-inner ul')
                    let links = await tab.$$('.artdeco-dropdown__content-inner ul li')
                    let litext1 = await tab.evaluate(e => e.innerText , links[2]);
                    litext1 = litext1.split(" ")[0];
                    if(litext1 === 'Message'){
                        await links[2].click()
                        await tab.waitForSelector('input[name="subject"]', {visible: true})
                        await tab.type('input[name="subject"]', 'Referral Request');
                        await tab.click('.msg-form__contenteditable');
                        await tab.type('.msg-form__contenteditable', credentials.message);

                        await waitfor(1000);
                        await tab.click('.msg-form__send-button');
                        idx++;
                    }
                    else{
                        await links[3].click()
                        let linktext3 = await tab.evaluate(e => e.innerText , links[3]);
                        if(linktext3.indexOf("\n") > -1){
                            linktext3 = linktext3.split("\n")
                            linktext3 = linktext3[0];
                        }
                        if(linktext3 === 'Pending' || linktext3 === 'Report / Block'){
                            let msgBTn = await tab.$('.message-anywhere-button.pv-s-profile-actions.pv-s-profile-actions--message.ml2.artdeco-button.artdeco-button--2.artdeco-button--muted.artdeco-button--primary')
                            if(msgBTn == null) continue;
                            await msgBTn.click();

                            await tab.waitForSelector('input[name="subject"]', {visible: true})
                            await tab.type('input[name="subject"]', 'Referral Request');
                            await tab.click('.msg-form__contenteditable');
                            await tab.type('.msg-form__contenteditable', credentials.message);

                            
                            await waitfor(1000);
                            await tab.click('.msg-form__send-button');
                            idx++;
                            continue;
                        }
                        else{
                            continue;
                        } 
                    }
             
            }
        }
		catch(err){
			console.error(err);
		}
	}
}
