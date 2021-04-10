module.exports = {
	run : async(br) => {
		try{
			let data = [];
			let tab = await br.newPage();
			await tab.goto('https://careers.microsoft.com/professionals/us/en/search-results?rk=l-c-engineering')
			await tab.waitForSelector('.facet-menu.au-target', {visible : true})
			const arrows = await tab.$$('.facet-menu.au-target')
			await arrows[0].click();
			let inputs = await tab.$$('.phs-checkbox.input-check-group')
			await inputs[1].click();
			await tab.waitForSelector('.jobs-list-item .job-title', {visible: true});
			let jobs = await tab.$$('.jobs-list-item');
			for(let job of jobs){
				let details = await tab.evaluate(e =>{
					let temp = {}
					temp.jobTitle = e.querySelector('.job-title').innerText
					temp.jobCategory = e.querySelector('.job-category').innerText
					temp.location = e.querySelector('.job-location') == null ? '-' : e.querySelector('.job-location').innerText
					temp.DatePosted = e.querySelector('.job-date').innerText
					temp.jobUrl = e.querySelector('a').getAttribute("href");
					temp.company = 'Microsoft'
					return temp;
				}, job)
				data.push(details); 
			}
			return data;
		}
		catch(err){
			console.error(err);
		}
	}
}