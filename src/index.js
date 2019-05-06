const fs = require('fs');
const parser = require('./parser.js');

let allId = [], allResponses = [], notUsed=[], notFound = [];
let container;

function validate() {
    const questions = document.getElementById("questionsValue").value;
    const results = document.getElementById("resultsValue").value;

    container = document.querySelector('.evaluation');

    // Clean everything
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    notUsed = [];
    notFound = [];



    Promise.all([parser('questions', questions), parser('results', results)])
    .then((datas)=> {
        console.log('data :', datas);
        
        datas.forEach(data => {
            data.forEach(d => {
                if (d.id) allId.push(d.id);
            })
        })

        // Loop through the questions, get all the responses
        datas[0].forEach(qns => {
            const responses = qns.responses.split(/(?:.*\)\s)(.*)(?:\n|)/).filter(Boolean);
            responses.forEach(response => {
                allResponses.push(response);
            })
        })

        checkNotFound();

        checkResultsNotUsed(datas[1]);
    })
    .catch(err => {renderError();});
}

function checkNotFound() {
    let found = false;
    allResponses.forEach(response => {
        found = false;
        allId.forEach(id => {
            if (response.trim() === id.trim()) found = true;
        })

        if (!found) notFound.push(response);
    })

    console.log('allId :', allId);

    
    const heading = document.createElement('h2');
    heading.innerText = 'IDs not found:';
    container.appendChild(heading);
    if (notFound.length > 0) {
        notFound.forEach(id => {
            const el = document.createElement('div');
            el.innerText = id;
            container.appendChild(el);
        })
    }
    else {
        const el = document.createElement('div');
        el.innerText = 'None';
        container.appendChild(el);
    }
    

}

function checkResultsNotUsed(results) {
    let found = false;

    results.forEach(result => {
        found = false;
        allResponses.forEach(response => {
            if (result.id.trim() === response.trim()) found = true;
        })

        if (!found) notUsed.push(result);
    })

    const heading = document.createElement('h2');
    heading.innerText = 'Result IDs that are not used:';
    container.appendChild(heading);

    if (notUsed.length > 0) {
        notUsed.forEach(result => {
            const el = document.createElement('div');
            el.innerText = result.id;
            container.appendChild(el);
        })
    }
    else {
        const el = document.createElement('div');
        el.innerText = 'None';
        container.appendChild(el);
    }
    
}

function renderError() {
    const el = document.createElement('div');
    el.innerText = 'Input format error. Please check your CSV input.';
    el.style.color = 'Red';
    container.appendChild(el);
}

window.onload = function(){
    const btn = document.getElementById("btnValidate");
    btn.onclick = validate;

    const questions = document.getElementById("questionsValue");
    const results = document.getElementById("resultsValue");
    questions.value = qnsData;
    results.value = resultData;
}

const resultData=
`Result ID,Result Content
R-approval-required,"<h2>This medication requires approval.</h2><p>You need an approval to bring in this medication.</p>
{{Summary: Medication requires approval to bring in.}}"
R-approval-not-required,"<h2>This medication does not require approval.</h2><p>You do not need an approval from us to bring in this medication.</p>
{{Summary: Approval not required.}}"
R-approval-not-required-3-months,"<h2>This medication does not require approval.</h2><p>You do not need an approval from us if you are bringing in less than 3 months’ supply of this medicine.</p>
{{Summary: Approval not required.}}"
R-prohibited,"<h2>{{ingredient}} is prohibited for personal import into Singapore. You cannot bring in this medication.</h2>
{{Summary: Medication contains active ingredients that are psychotropic and/or controlled substances.}}"
R-prohibited-Nct,"<h2>Nicotine gums not registered in Singapore is prohibited for personal import. You cannot bring in this medication.</h2><p>You might want to consider purchasing nicotine gums that are registered in Singapore instead.</p>
{{Summary: Nicotine gums not registered in Singapore is prohibited.}}"
R-approval-required-3-months,"<h2>This medication requires approval.</h2><p>You need an approval to bring in more than 3 months of supply of this medication.</p>
{{Summary: Approval is required if you are bringing medication with more than 3 months' supply}}"
R-approval-required-codeine-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Codeine.</p>
{{Summary: Approval is required if you are bringing more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Codeine.}}"
R-approval-required-codeine-tablet-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Codeine with total quantity more than 20 tablets/capsules.</p>
{{Summary: Approval is required if your medication contains Codeine with total quantity more than 20 tablets/capsules.}}"
R-approval-required-codeine-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule for your medication has more than 30 mg of Codeine.</p>
{{Summary: Approval is required if each tablet/capsule for your medication has more than 30 mg of Codeine.}}"
R-approval-required-codeine-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 240 ml liquid and each 5 ml of liquid has more than 15 mg of Codeine.</p>
{{Summary: Approval is required if you are bringing more than 240 ml liquid and each 5 ml of liquid has more than 15 mg of Codeine.}}"
R-approval-required-codeine-liquid-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Codeine with total quantity more than 240 ml liquid.</p>
{{Summary: Approval is required if your medication contains Codeine with total quantity more than 240 ml liquid.}}"
R-approval-required-codeine-liquid-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each 5 ml of liquid has more than 15 mg of Codeine.</p>
{{Summary: Approval is required if each 5 ml of liquid has more than 15 mg of Codeine.}}"
R-approval-required-dextromethorphan-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Dextromethorphan.</p>
{{Summary: Approval is required if you are bringing more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Dextromethorphan.}}"
R-approval-required-dextromethorphan-tablet-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Dextromethorphan with total quantity more than 20 tablets/capsules.</p>
{{Summary: Approval is required if your medication contains Dextromethorphan with total quantity more than 20 tablets/capsules.}}"
R-approval-required-dextromethorphan-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule for your medication has more than 30 mg of Dextromethorphan.</p>
{{Summary: Approval is required if each tablet/capsule for your medication has more than 30 mg of Dextromethorphan.}}"
R-approval-required-dextromethorphan-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 240 ml liquid and each 5 ml of liquid has more than 15 mg of Dextromethorphan.</p>
{{Summary: Approval is required if you are bringing more than 240 ml liquid and each 5 ml of liquid has more than 15 mg of Dextromethorphan.}}"
R-approval-required-dextromethorphan-liquid-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Dextromethorphan with total quantity more than 240 ml liquid.</p>
{{Summary: Approval is required if your medication contains Dextromethorphan with total quantity of more than 240 ml liquid.}}"
R-approval-required-dextromethorphan-liquid-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each 5 ml of liquid has more than 15 mg of Dextromethorphan.</p>
{{Summary: Approval is required if each 5 ml of liquid has more than 15 mg of Dextromethorphan.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 20 tablets/capsules, each tablet/capsule has more than 30 mg of Codeine, and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if your medication has more than 20 tablets/capsules, each tablet/capsule has more than 30 mg of Codeine, and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-quantity-strength-codeine,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Codeine.</p>
{{Summary: Approval is required if your medication has more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Codeine.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-quantity-strength-ephedrine,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 20 tablets/capsules and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if your medication has more than 20 tablets/capsules and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-strength-codeine-strength-ephedrine,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule of your medication has more than 30 mg of Codeine and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if each tablet/capsule of your medication has more than 30 mg of Codeine and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-ephedrine-psudoephedrine-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if your medication contains more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-ephedrine-pseudoephedrine-tablet-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 20 tablets/capsules.</p>
{{Summary: Approval is required if your medication has more than 20 tablets/capsules.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if your medication is more than 240 ml, each 5 ml has more than 15 mg of Codeine, and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if your medication is more than 240 ml, each 5 ml has more than 15 mg of Codeine, and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-quantity-strength-codeine,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 240 ml and each 5 ml has more than 15 mg of Codeine.</p>
{{Summary: Approval is required if you are bringing more than 240 ml and each 5 ml has more than 15 mg of Codeine.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-quantity-strength-ephedrine,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 240 ml and it has more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if you are bringing more than 240 ml and it has more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-strength-codeine-strength-ephedrine,"<h2>This medication requires approval.</h2><p>You need an approval if each 5 ml of your medicatoin has more than 15 mg of Codeine and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if each 5 ml of your medicatoin has more than 15 mg of Codeine and there is more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-required-ephedrine-pseudoephedrine-liquid-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 240 ml in total.</p>
{{Summary: Approval is required if your medication has more than more than 240 ml in total.}}"
R-approval-required-dextromethorphan-ephedrine-pseudoephedrine-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 21.6 g of Ephedrine/Pseudoephedrine or more than 20 tablets/capsules and each tablet/capsule has more than 30 mg of Codeine.</p>
{{Summary: Approval is required if your medication has more than 21.6 g of Ephedrine/Pseudoephedrine or 20 tablets/capsules and each tablet/capsule has more than 30 mg of Dextromethorphan.}}"
R-approval-required-dextromethorphan-ephedrine-pseudoephedrine-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 21.6 g of Ephedrine/Pseudoephedrine or more than 240 ml in total and each 5 ml has more than 15 mg of Codeine</p>
{{Summary: Approval is required if your medication has more than 21.6 g of Ephedrine/Pseudoephedrine or more than 240 ml in total and each 5 ml has more than 15 mg of Dextromethorphan.}}"
R-approval-required-cd-ps,"<h2>This medication requires approval.</h2><p>You need an approval to bring in this medication because it contains {{ingredient}}, which is classified as controlled substance(s) in Singapore.</p>
{{Summary: Approval is required for ingredient(s) classified as controlled substance(s) in Singapore.}}"
R-approval-required-controlled-drugs-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 100 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and your medication has more than 100 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if your medication has more than 100 mg of {{ingredient}} in each tablet/capsule.</p>
{{Summary: Approval is required if your medication has more than 100 mg of {{ingredient}} in each tablet/capsule.}}"
R-approval-required-controlled-drugs-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 25 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 25 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-liquid-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each 1 ml of your medication has more than 25 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each 1 ml of your medication has more than 25 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd2-others,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 1 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 1 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd2-others-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each 1 ml of your medication has more than 1 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each 1 ml of your medication has more than 1 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd3-liquid,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 2 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each 1 ml of your medication has more than 2 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd3-liquid-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each 1 ml of your medication has more than 2 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each 1 ml of your medication has more than 2 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd4-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 135 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 135 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd4-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule has more than 135 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each tablet/capsule has more than 135 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd5-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 0.5 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 0.5 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd5-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule of your medication has more than 0.5 mg of {{ingredient}} in each tablet/capsule.</p>
{{Summary: Approval is required if each tablet/capsule has more than 0.5 mg of {{ingredient}} in each tablet/capsule.}}"
R-approval-required-controlled-drugs-cd5-atropine,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Atropine Sulfate with quantity more than 5% of the dosage of {{ingredient}}.</p>
{{Summary: Approval is required if your medication contains Atropine Sulfate with quantity more than 5% of the dosage of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd6-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 2.5 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 2.5 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd6-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule of your medication has more than 2.5 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each tablet/capsule has more than 2.5 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd6-atropine,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Atropine Sulfate with quantity more than 1% of the dosage of {{ingredient}}.</p>
{{Summary: Approval is required if your medication contains Atropine Sulfate with quantity more than 1% of the dosage of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd7-tablet,"<h2>This medication requires approval.</h2><p>You need an approval if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 100 mg of {{ingredient}}.</p>
{{Summary: Approval is required if you are bringing more than 3 months of supply of this medication and each tablet/capsule has more than 100 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd7-tablet-strength,"<h2>This medication requires approval.</h2><p>You need an approval if each tablet/capsule of your medication has more than 100 mg of {{ingredient}}.</p>
{{Summary: Approval is required if each tablet/capsule has more than 100 mg of {{ingredient}}.}}"
R-approval-required-controlled-drugs-cd7-methylcellulose,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains Methylcellulose that is stronger than the dosage of {{ingredient}}.</p>
{{Summary: Approval is required if your medication contains Methylcellulose that is stronger than the dosage of {{ingredient}}.}}"
R-approval-required-ephedrine-psudoephedrine-quantity,"<h2>This medication requires approval.</h2><p>You need an approval if your medication contains more than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is required if your medication contains more than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-not-required-codeine-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Codeine.</p>
{{Summary: Approval is not required if you are bringing less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Codeine.}}"
R-approval-not-required-codeine-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 240 ml liquid and each 5 ml of liquid has less than 15 mg of Codeine.</p>
{{Summary: Approval is not required if you are bringing less than 240 ml liquid and each 5 ml of liquid has less than 15 mg of Codeine.}}"
R-approval-not-required-dextromethorphan-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Dextromethorphan.</p>
{{Summary: Approval is not required if you are bringing less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Dextromethorphan.}}"
R-approval-not-required-dextromethorphan-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 240 ml liquid and each 5 ml of liquid has less than 15 mg of Dextromethorphan.</p>
{{Summary: Approval is not required if you are bringing less than 240 ml liquid and each 5 ml of liquid has less than 15 mg of Dextromethorphan.}}"
R-approval-not-required-codeine-ephedrine-pseudoephedrine-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Codeine.</p>
{{Summary: Approval is not required if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or 20 tablets/capsules and each tablet/capsule has less than 30 mg of Codeine.}}"
R-approval-not-required-codeine-ephedrine-pseudoephedrine-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 240 ml in total and each 5 ml has less than 15 mg of Codeine</p>
{{Summary: Approval is not required if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 240 ml in total and each 5 ml has less than 15 mg of Codeine.}}"
R-approval-not-required-codeine-ephedrine-pseudoephedrine-tablet-duration,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 20 tablets/capsules, each tablet/capsule has less than 30 mg of Codeine, and there is less than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is not required if you are bringing less than 20 tablets/capsules, each tablet/capsule has less than 30 mg of Codeine, and there is less than 21.6 g of Ephedrine or Pseudoephedrine in total.}}"
R-approval-not-required-codeine-ephedrine-pseudoephedrine-liquid-duration,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 20 tablets/capsules, each tablet/capsule has less than 30 mg of Codeine, and there is less than 21.6 g of Ephedrine or Pseudoephedrine in total.</p>
{{Summary: Approval is not required if you are bringing less than 20 tablets/capsules, each tablet/capsule has less than 30 mg of Codeine, and there is less than 21.6 g of Ephedrine or Pseudoephedrine in total.}"
R-approval-not-required-ephedrine-psudoephedrine-duration-quantity,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this medication and it contains less than 21.6 g of Ephedrine/Pseudoephedrine.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and it contains less than 21.6 g of Ephedrine/Pseudoephedrine..}}"
R-approval-not-required-ephedrine-pseudoephedrine-liquid-quantity,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication has less than 240 ml in total or 21.6 g of Ephedrine/Pseudoephedrine.</p>
{{Summary: Approval is not required if your medication has less than less than 240 ml in total or 21.6 g of Ephedrine/Pseudoephedrine.}}"
R-approval-not-required-dextromethorphan-ephedrine-pseudoephedrine-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 20 tablets/capsules and each tablet/capsule has less than 30 mg of Codeine.</p>
{{Summary: Approval is not required if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or 20 tablets/capsules and each tablet/capsule has less than 30 mg of Dextromethorphan.}}"
R-approval-not-required-dextromethorphan-ephedrine-pseudoephedrine-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 240 ml in total and each 5 ml has less than 15 mg of Codeine</p>
{{Summary: Approval is not required if your medication has less than 21.6 g of Ephedrine/Pseudoephedrine or less than 240 ml in total and each 5 ml has less than 15 mg of Dextromethorphan.}}"
R-approval-not-required-controlled-drugs-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug and each tablet/capsule has less than 100 mg of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and each tablet/capsule has less than 100 mg of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug and each 1 ml has less than 25mg of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and each 1 ml has less than 25mg of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-injection,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if your medication is in the form of injection.</p>
{{Summary: Approval is not required if your medication is in the form of injection.}}"
R-approval-not-required-controlled-drugs-cd2-others,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug and each 1 ml has less than 1mg of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and each 1 ml has less than 1mg of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-cd3-liquid,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug and each 1 ml has less than 2mg of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and each 1 ml has less than 2mg of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-cd4-tablet,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug and each tablet/capsule has less than 135mg of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this medication and each tablet/capsule has less than 135mg of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-cd5-atropine,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 0.5 mg of {{ingredient}}, and it does not contain Atropine Sulfate with quantity more than 5% of the dosage of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 0.5 mg of {{ingredient}}, and it does not contain Atropine Sulfate with quantity more than 5% of the dosage of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-cd6-atropine,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 2.5 mg of {{ingredient}}, and it does not contain Atropine Sulfate with quantity more than 1% of the dosage of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 2.5 mg of {{ingredient}}, and it does not contain Atropine Sulfate with quantity more than 1% of the dosage of {{ingredient}}.}}"
R-approval-not-required-controlled-drugs-cd7-methylcellulose,"<h2>This medication does not require approval.</h2><p>You are exempted from an approval from us if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 2.5 mg of {{ingredient}}, and it does not contain Methylcellulose that is stronger than the dosage of {{ingredient}}.</p>
{{Summary: Approval is not required if you are bringing less than 3 months of supply of this controlled drug, each tablet/capsule has less than 2.5 mg of {{ingredient}}, and it does not contain Methylcellulose that is stronger than the dosage of {{ingredient}}.}}"`;

const qnsData = 
`Question ID,Question Text,Input Field Type,Answers,Responses,Default Answer ID
Q-Start,<p>Enter all the active ingredients in your medication.</p>,Solr,[1] https://search.olasearch.com/hsa/tm/suggest?q=,"(isSelected: CBD) R-approval-required
(isSelected: CD) R-approval-required
(isSelected: CD1) Qf-CD1-start
(isSelected: CD2) Qf-CD2-start
(isSelected: CD3) Qf-CD3-start
(isSelected: CD4) Qf-CD4-start
(isSelected: CD5) Qf-CD5-start
(isSelected: CD6) Qf-CD6-start
(isSelected: CD7) Qf-CD7-start
(isSelected: CD8) R-approval-required
(isSelected: Cdn) Qf-Cdn-start
(isSelected: CE) Qf-CE-start
(isSelected: DE) Qf-DE-start
(isSelected: Dxt) Qf-Dxt-start
(isSelected: E/PE) Qd-E/PE-start
(isSelected: Nct) Qf-Nct-start
(isSelected: NSC) Qd-NSC-start
(isSelected: Ntp) R-approval-required
(isSelected: PS) R-approval-required
(isSelected: S4) R-prohibited
(isSelected: N/A) R-approval-required
(isSelected: HS) R-approval-not-required",
Qd-NSC-start,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-3-months",
Qf-Cdn-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) R-approval-required
(isSelected: 1) Qdesc-Cdn-tablet
(isSelected: 2) Qdesc-Cdn-liquid",
Qdesc-Cdn-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 20 tablets/capsules
[2] Strength: more than 30 mg of Codeine in each tablet/capsule 
[3*] None of the above","(isSelected: 3) R-approval-not-required-codeine-tablet
(isSelected: 1)(isSelected: 2) R-approval-required-codeine-tablet
(isSelected: 1) R-approval-required-codeine-tablet-quantity
(isSelected: 2) R-approval-required-codeine-tablet-strength",
Qdesc-Cdn-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 240 ml
[2] Strength: more than 15 mg of Codeine in each 5 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-codeine-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-codeine-liquid
(isSelected: 1) R-approval-required-codeine-liquid-quantity
(isSelected: 2) R-approval-required-codeine-liquid-strength",
Qf-Dxt-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) Qd-Dxt-other-dosage-form
(isSelected: 1) Qdesc-Dxt-tablet
(isSelected: 2) Qdesc-Dxt-liquid",
Qdesc-Dxt-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 20 tablets/capsules
[2] Strength: more than 30 mg of Dextromethorphan in each tablet/capsule 
[3*] None of the above","(isSelected: 3) R-approval-not-required-dextromethorphan-tablet
(isSelected: 1)(isSelected: 2) R-approval-required-dextromethorphan-tablet
(isSelected: 1) R-approval-required-dextromethorphan-tablet-quantity
(isSelected: 2) R-approval-required-dextromethorphan-tablet-strength",
Qdesc-Dxt-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 240 ml
[2] Strength: more than 15 mg of Dextromethorphan in each 5 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-dextromethorphan-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-dextromethorphan-liquid
(isSelected: 1) R-approval-required-dextromethorphan-liquid-quantity
(isSelected: 2) R-approval-required-dextromethorphan-liquid-strength",
Qd-Dxt-other-dosage-form,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-3-months",
Qf-CE-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) R-approval-required-cd-ps
(isSelected: 1) Qdesc-CE-tablet
(isSelected: 2) Qdesc-CE-liquid",
Qdesc-CE-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 20 tablets/capsules 
[2] Strength: more than 30 mg of Codeine in each tablet/capsule
[3] Strength: more than 21.6 g of Ephedrine or Pseudoephedrine in total 
[4*] None of the above","(isSelected: 4) Qd-CE-tablet-duration
(isSelected: 1)(isSelected: 2) R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-quantity-strength-codeine
(isSelected: 1)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-quantity-strength-ephedrine
(isSelected: 2)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-tablet-strength-codeine-strength-ephedrine
(isSelected: 1)(isSelected: 2)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-tablet
(isSelected: 1) R-approval-required-ephedrine-pseudoephedrine-tablet-quantity
(isSelected: 2) R-approval-required-codeine-tablet-strength
(isSelected: 3) R-approval-required-ephedrine-psudoephedrine-quantity",
Qdesc-CE-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 240 ml in total
[2] Strength: more than 15 mg of Codeine in each 5 ml 
[3] Strength: more than 21.6 g of Ephedrine or Pseudoephedrine in total
[4*] None of the above","(isSelected: 4) Qd-CE-liquid-duration
(isSelected: 1)(isSelected: 2) R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-quantity-strength-codeine
(isSelected: 1)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-quantity-strength-ephedrine
(isSelected: 2)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-liquid-strength-codeine-strength-ephedrine
(isSelected: 1)(isSelected: 2)(isSelected: 3) R-approval-required-codeine-ephedrine-pseudoephedrine-liquid
(isSelected: 1) R-approval-required-ephedrine-pseudoephedrine-liquid-quantity
(isSelected: 2) R-approval-required-codeine-liquid-strength
(isSelected: 3) R-approval-required-ephedrine-psudoephedrine-quantity",
Qd-CE-tablet-duration,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-codeine-ephedrine-pseudoephedrine-tablet-duration",
Qd-CE-liquid-duration,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-codeine-ephedrine-pseudoephedrine-liquid-duration",
Qf-DE-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) Qd-DE-other-dosage-form
(isSelected: 1) Qdesc-DE-tablet
(isSelected: 2) Qdesc-DE-liquid",
Qdesc-DE-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 20 tablets/capsules or more than 21.6 g of Ephedrine or Pseudoephedrine
[2] Strength: more than 30 mg of Dextromethorphan in each tablet/capsule 
[3*] None of the above","(isSelected: 3) R-approval-not-required-dextromethorphan-ephedrine-pseudoephedrine-tablet
(isSelected: 1)(isSelected: 2) R-approval-required-dextromethorphan-ephedrine-pseudoephedrine-tablet
(isSelected: 1) R-approval-required-ephedrine-pseudoephedrine-tablet-quantity
(isSelected: 2) R-approval-required-dextromethorphan-tablet-strength",
Qdesc-DE-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Quantity: more than 240 ml in total or more than 21.6 g of Ephedrine or Pseudoephedrine
[2] Strength: more than 15 mg of Dextromethorphan in each 5 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-dextromethorphan-ephedrine-pseudoephedrine-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-dextromethorphan-ephedrine-pseudoephedrine-liquid
(isSelected: 1) R-approval-required-ephedrine-pseudoephedrine-liquid-quantity
(isSelected: 2) R-approval-required-dextromethorphan-liquid-strength",
Qd-DE-other-dosage-form,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-3-months",
Qf-CD1-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) R-approval-required-cd-ps
(isSelected: 1) Qdesc-CD1-tablet
(isSelected: 2) Qdesc-CD1-liquid",
Qdesc-CD1-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 100 mg of {{ingredient}} in each tablet/capsule 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-tablet
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-tablet
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-tablet-strength",
Qdesc-CD1-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 25 mg of {{ingredient}} in each 1 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-liquid
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-liquid-strength",
Qf-CD2-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Oral liquid
[2] Others","(isSelected: 1) Qdesc-CD2-others
(isSelected: 2) R-approval-required-cd-ps",
Qdesc-CD2-others,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 1 mg of {{ingredient}} in each 1 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-cd2-others
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd2-others
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd2-others-strength",
Qf-CD3-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Oral liquid
[2] Others","(isSelected: 1) Qdesc-CD3-liquid
(isSelected: 2) R-approval-required-cd-ps",
Qdesc-CD3-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 2 mg of {{ingredient}} in each 1 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-cd3-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd3-liquid
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd3-liquid-strength",
Qf-CD4-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Oral liquid
[3*] None of the above","(isSelected: 3) R-approval-required-cd-ps
(isSelected: 1) Qdesc-CD4-tablet
(isSelected: 2) Qdesc-CD4-liquid",
Qdesc-CD4-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 135 mg of {{ingredient}} in each tablet/capsule 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-cd4-tablet
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd4-tablet
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd4-tablet-strength",
Qdesc-CD4-liquid,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 25 mg of {{ingredient}} in each 1 ml 
[3*] None of the above","(isSelected: 3) R-approval-not-required-controlled-drugs-liquid
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-liquid
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-liquid-strength",
Qf-CD5-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Others","(isSelected: 1) Qdesc-CD5-tablet
(isSelected: 2) R-approval-required-cd-ps",
Qdesc-CD5-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 0.5 mg of {{ingredient}} in each tablet/capsule 
[3*] None of the above","(isSelected: 3) Q-CD5-atropine
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd5-tablet
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd5-tablet-strength",
Q-CD5-atropine,<p>Does your medication contains Atropine Sulfate with quantity more than 5% of the dosage of {{ingredient}}</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-controlled-drugs-cd5-atropine
(isSelected: 2) R-approval-not-required-controlled-drugs-cd5-atropine",
Qf-CD6-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Others","(isSelected: 1) Qdesc-CD6-tablet
(isSelected: 2) R-approval-required-cd-ps",
Qdesc-CD6-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 2.5 mg of {{ingredient}} in each tablet/capsule 
[3*] None of the above","(isSelected: 3) Q-CD6-atropine
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd6-tablet
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd6-tablet-strength",
Q-CD6-atropine,<p>Does your medication contains Atropine Sulfate with quantity more than 1% of the dosage of {{ingredient}}?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-controlled-drugs-cd6-atropine
(isSelected: 2) R-approval-not-required-controlled-drugs-cd6-atropine",
Qf-CD7-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Tablet/capsule
[2] Others","(isSelected: 1) Qdesc-CD7-tablet
(isSelected: 2) R-approval-required-cd-ps",
Qdesc-CD7-tablet,<p>Select any of the following that applies for this medication:</p>,Checkbox,"[1] Duration: more than 3 months in supply
[2] Strength: more than 100 mg of {{ingredient}} in each tablet/capsule 
[3*] None of the above","(isSelected: 3) Q-CD7-methylcellulose
(isSelected: 1)(isSelected: 2) R-approval-required-controlled-drugs-cd7-tablet
(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-required-controlled-drugs-cd7-tablet-strength",
Q-CD7-methylcellulose,<p>Does your medication contains Methylcellulose that is stronger than the dosage of {{ingredient}}?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-controlled-drugs-cd7-methylcellulose
(isSelected: 2) R-approval-not-required-controlled-drugs-cd7-methylcellulose",
Qd-E/PE-start,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) Q-E/PE-ingredient",
Q-E/PE-ingredient,Are you bringing in more than 21.6 g of Ephedrine or Pseudoephedrine in total?,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-ephedrine-psudoephedrine-quantity
(isSelected: 2) R-approval-not-required-ephedrine-psudoephedrine-duration-quantity",
Qf-Nct-start,<p>What is the dosage form of your medication?</p>,Radio,"[1] Gums
[2] Tablets/capsules
[3] Lozenges
[4] Patches
[5] Spray/inhaler
[6*] None of the above","(isSelected: 6) R-approval-required
(isSelected: 1) Q-Nct-gums
(isSelected: 2) Qd-Nct-duration
(isSelected: 3) Qd-Nct-duration
(isSelected: 4) Qd-Nct-duration
(isSelected: 5) Qd-Nct-duration",
Q-Nct-gums,<p>Can you find a Singapore registration number (e.g. SIN12345P) on your medication packaging?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) Qd-Nct-duration
(isSelected: 2) R-prohibited-Nct",
Qd-Nct-duration,<p>Are you bringing more than 3 months supply of this medication?</p>,Buttons,"[1] Yes
[2] No","(isSelected: 1) R-approval-required-3-months
(isSelected: 2) R-approval-not-required-3-months",`;