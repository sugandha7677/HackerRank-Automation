const puppeteer = require('puppeteer');

const codeObj = require('./codes')

const loginLink = 'https://www.hackerrank.com/auth/login';
const email = 'sugandhatiwary7677@gmail.com';
const password = '123456789';


// using effi function to open the browser

(async function (){

    try{
        // open browser 
        const browserOpen = await puppeteer.launch({
        headless: false,   // to provide visibility to the browser
        slowMo: true,
        defaultViewport: null,
        args: ["--start-maximized"] // fullscreen
    });

    // go to new tab of the opened browser
    let newTab = await browserOpen.newPage();

    // to the Hackerrank login page 
    await newTab.goto(loginLink);

    // enter email and password in respective field to login to account
    await newTab.type("input[id='input-1']" , email ,{delay: 50});
    await newTab.type("input[id='input-2']" , password ,{delay: 50});

    // click on login button
    await newTab.click('button[data-analytics="LoginPassword"]' , {delay: 50});

    // go to algorithm section 
    await waitAndClick('.topic-card a[data-attr1="algorithms"]',newTab);

    // go to warmup section
    await waitAndClick('.checkbox-input[value="warmup"]', newTab);

    // get an array of all questions set available in warmup section
    let allQuestions = await newTab.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled" , {delay: 5000}) // shorthand for document for queryselector all

    // checking the length of array i.e total number of questions
    console.log(`The length of array is ${allQuestions.length}`);

    // calling the function to work on the problem by passing the fisrt question of the set and its answer
    await  questionSolver(newTab , allQuestions[0] , codeObj.answers[0]);


    }catch(error){
        console.log(error);
    }

})()



// defining waitAndClick function

async function waitAndClick(selector , cPage){
    await cPage.waitForSelector(selector); // wait for the respective selector

    let selectorClicked = cPage.click(selector);
    return selectorClicked;
}


// defining the questionSolver function 

async function questionSolver(page , question , answer){

    // go the respective problem
    await question.click({delay: 200});

    // go to the editor section of the problem
    await waitAndClick(".monaco-editor.no-user-select.vs" ,page , {delay: 100});
    
    // we cant directly code in the editor section as there we have autoclosing options for the braces of the function, so we will get to braces at a time,gonna throw error

    // so to get to the test againts input section
    await  waitAndClick(".checkbox-input" , page , {delay: 100});

    // select the textarea where we will check our code
    await page.waitForSelector('textarea.custominput' , page);

    // type our code 
    await page.type('textarea.custominput' , answer ,{delay: 100});
   
    // copy that written code
    await page.keyboard.down('Control');

    await page.keyboard.press('A' , {delay: 500});

    await  page.keyboard.press('X' , {delay: 500});

    await page.keyboard.up('Control');

    // go to the editor section
    await  waitAndClick(".monaco-editor.no-user-select.vs" ,page);

    // paste the copied code
    await  page.keyboard.down('Control');

    await page.keyboard.press('A' , {delay: 500});

    await page.keyboard.press('V' , {delay: 500});

    await page.keyboard.up('Control');

    // click run code button
    await page.click('.hr-monaco__run-code' ,{delay: 500})

}


