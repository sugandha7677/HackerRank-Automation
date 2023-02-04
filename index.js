const puppeteer = require('puppeteer');

const codeObj = require('./codes')

const loginLink = 'https://www.hackerrank.com/auth/login';
const email = 'sugandhatiwary7677@gmail.com';
const password = '123456789'

let page;

// open browser  it will return promise
const browserOpen = puppeteer.launch({
    headless: false,   // visibility
    slowMo: true,
    defaultViewport: null,
    args: ["--start-maximized"] // fullscreen
});

browserOpen.then(function (browserContextObj){
    const pagesArrPromise = browserContextObj.pages();
    return pagesArrPromise;
}).then(function(browserPages){
    page = browserPages[0];
    let hackerrankOpenPromise = page.goto(loginLink);
    return hackerrankOpenPromise;
}).then(function(){
    let emailIsEntered = page.type("input[id='input-1']" , email ,{dalay: 50});
    return emailIsEntered;
}).then(function(){
    let passwordIsEntered = page.type("input[id='input-2']" , password ,{dalay: 50});
    return passwordIsEntered;
}).then(function(){
    let loginButtonPressed = page.click('button[data-analytics="LoginPassword"]' , {delay: 50});
    return loginButtonPressed;
}).then(function(){
    let clickOnAlgoPromise = waitAndClick('.topic-card a[data-attr1="algorithms"]',page);
    return clickOnAlgoPromise;
}).then(function(){
    let getToWarmUp = waitAndClick('.checkbox-input[value="warmup"]', page);
    return getToWarmUp;
}).then(function(){ // funs to select all questions , will give in array form
    let allQuestions = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled" , {dalay: 5000}) // shorthand for document for queryselector all
    return allQuestions;
}).then(function(questionsArr){
    console.log(`array length: ${questionsArr.length}`);
    let questionWillBeSolved = questionSolver(page , questionsArr[0] , codeObj.answers[0]);
    return questionWillBeSolved;
}).catch(function(error){
    console.log(error)
})


// wihtout opening the page , we cant target the elements 
// will throw an error

// this fns is bassically waiting for that particular element which takes some time to reload 
// when we direct to the page , after then only it will choose that selecotr

function waitAndClick(selector , cPage){
    return new Promise(function(resolve , reject){
        let waitForModelPromise = cPage.waitForSelector(selector); // wait for the respective selector
        waitForModelPromise.then(function(){
            let clickModel = cPage.click(selector);
            return clickModel;
        }).then(function(){
            resolve();
        }).catch(function(){
            reject();
        })
    })
}


function questionSolver(page , question , answer){
    return new Promise(function(resolve , reject){
        let questionWillBeClicked = question.click();
        questionWillBeClicked.then(function(){ // here we want to go to the text area
            let EditorInFocus = waitAndClick(".monaco-editor.no-user-select.vs" ,page);
            return EditorInFocus;
        })
        .then(function(){
            let customInputs = waitAndClick(".checkbox-input" , page);
            return customInputs;
        })
        .then(function(){
            return page.waitForSelector('textarea.custominput' , page);
        })
        .then(function(){
            return page.type('textarea.custominput' , answer ,{delay: 10})
        }).then(function(){
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
        }).then(function(){
            let AisPressed = page.keyboard.press('A' , {delay: 100});
            return AisPressed;
        }).then(function(){
            let XisPressed = page.keyboard.press('X' , {delay: 100});
            return XisPressed;
        })
        .then(function(){
            let CtrlIsUnPressed = page.keyboard.up('Control');
            return CtrlIsUnPressed;
        }).then(function(){
            let mainEditorInFocus = waitAndClick(".monaco-editor.no-user-select.vs" ,page);
            return mainEditorInFocus;
        }).then(function(){
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
        }).then(function(){
            let AisPressed = page.keyboard.press('A' , {dealy: 100});
            return AisPressed;
        }).then(function(){
            let VisPressed = page.keyboard.press('V' , {dealy: 100});
            return VisPressed;
        }).then(function(){
            let CtrlIsUnPressed = page.keyboard.up('Control');
            return CtrlIsUnPressed;
        }).then(function(){
            return page.click('.hr-monaco__run-code' ,{delay: 50})
        }).then(function(){
            resolve();
        }).catch(function(error){
            reject();
        })
    })
}