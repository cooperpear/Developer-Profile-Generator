const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
var pdf = require('html-pdf');
var html = fs.readFileSync('index.html', 'utf8');
var options = { format: 'Letter' };
const axios = require("axios");
let color = null;

function promptUser() {
  return inquirer.prompt([

    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    },
    {
      type: "input",
      name: "color",
      message: "Whats your favorite color?"
    }
  ]);
}
function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>

  <style>
#filecontainer {background-color: ${answers.color};}
 .jumbotron{
               background-color: ${answers.color};
           }

  </style>

</head>

<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container" id = "filecontainer">
    <h1 class="display-4">Hi! My name is ${answers.data.name}</h1>
    <p class="lead">I am from ${answers.data.location}.</p>
    <h3>Developer Profile Generator <span class="badge badge-secondary">Contact Me at ${answers.data.email}</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.data.login}</li>
      <li class="list-group-item">Bio: ${answers.data.bio}</li>
      <li class="list-group-item">Public repositories: ${answers.data.public_repos}</li>
      <li class="list-group-item">followers: ${answers.data.followers}</li>
      <li class="list-group-item">Bio: ${answers.data.bio}</li>
      <li class="list-group-item">Stars: ${answers.data.starred_url}</li>
      <li class="list-group-item">following: ${answers.data.following}</li>
    </ul>

<div id= "image">
<img src= "${answers.data.avatar_url}" height="200" width="200">

</div>

  </div>
</div>
</body>
</html>`;
}


promptUser()
  .then(function (answers) {
    color = answers.color;
    return axios.get(`https://api.github.com/users/${answers.github}`)
  })
  .then(function (data) {
    console.log("Successfully wrote to index.html", data.data);
    return ({ data: data.data, color: color })

  })
  .then(function (answers) {
    const html = generateHTML(answers);
    return writeFileAsync("index.html", html);
  })
  .then(function (html) {
    console.log("Successfully wrote to index.html");
    const htmlfile = fs.readFileSync("index.html", "utf8")
    pdf.create(htmlfile, options).toFile("index.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log("successfully wrote to pdf file");
    });

  })
  .catch(function (err) {
    console.log(err);
  });



