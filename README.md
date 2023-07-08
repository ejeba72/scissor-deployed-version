<div align="center"> 
  <img src="./public/scissor-logo.png" height="100" id="qrcode-img" alt="Scissor logo">
  <h1>Scissor</h1>
  <p><em>Scissor is the easiest to use URL shortener!</em></p>
</div>

<!-- Scissor is the easiest to use URL shortener! -->

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#application-description">Application Description</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a>
</p>
<p align="center">
  <a href="#testing">Testing</a> •
  <a href="#models">Models</a> •
  <a href="#api-routes">API Routes</a> •
  <a href="#base-url">Base URL</a> •
  <a href="#contributor">Contributor</a>
</p>

<div align="center">
  <h2 id="tech-stack">Tech Stack</h2>
</div>

<div align="center">

  ![Static Badge](https://img.shields.io/badge/Node.js-dark_green)
  ![Static Badge](https://img.shields.io/badge/Express-gray)
  ![Static Badge](https://img.shields.io/badge/MongoDB-green)
  ![Static Badge](https://img.shields.io/badge/Redis-red)
  ![Static Badge](https://img.shields.io/badge/TypeScript-blue)
![Static Badge](https://img.shields.io/badge/EJS-brown)

</div>

## Application Description
Brief is the new black, this is what inspires the team at Scissor. In today’s world, it’s important to keep things as short as possible, and this applies to more concepts than you may realize. From music, speeches, to wedding receptions, brief is the new black. Scissor is a simple tool which makes URLs as short as possible. Scissor thinks it can disrupt the URL shortening industry and give the likes of bit.ly and ow.ly a run for their money within 2 years.

## Features
- #### URL Shortening:
Scissor allows users to shorten URLs by pasting a long URL into the Scissor platform and a shorter URL gets automatically generated. The shortened URL is designed to be as short as possible, making it easy to share on social media or through other channels.
- #### Custom URLs:
Scissor also allows users to customize their shortened URLs. Users can choose their own custom domain name and customize the URL to reflect their brand or content. This feature is particularly useful for individuals or small businesses who want to create branded links for their 
- #### QR Code Generation:
Scissor allows users to also generate QR codes for the shortened URLs. Users can download the QR code image and use it in their promotional materials or/and on their website. This feature will be implemented using a third-party QR code generator API, which can be integrated into the Scissor platform.
- #### Analytics:
Scissor provides basic analytics that allow users to track their shortened URL's performance. Users can see how many clicks their shortened URL has received and where the clicks are coming from. We need to track when a URL is used.
- #### Link History:
Scissor allows users to see the history of links they’ve created so they can easily find and reuse links they have previously created.

## Installation

- Clone this repository into your local machine:

```git clone https://github.com/ejeba72/scissor.git```

- Set up your environment variables using the "example.env" as a guide.

- Install dependencies: ```yarn```

- Start the application by running ```yarn dev```

## Testing

- run test using ```yarn test```

## Models

### User

| field     | data_type | constraints            |
| --------- | --------- | ---------------------- |
| firstname | string    | required               |
| lastname  | string    | required               |
| email     | string    | required, unique       |
| username  | string    | required               |
| password  | string    | required, minlength: 8 |

### URL

| field              | data_type | constraints        |
| ------------------ | --------- | ------------------ |
| longUrl            | string    | required           |
| customUrl          | string    | optional           |
| shortUrl           | string    | (not a user field) |
| qrcodeFileLocation | string    | (not a user field) |
| userId             | string    | (not a user field) |
| qrcodeRequested    | boolean   | (html checkbox)    |
| clicks             | number    | (not a user field) |
| clickDetails       | Array     | (not a user field) |


## API Routes

<table>
<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>

<tr><td>GET</td> <td>/</td> <td>Scissor homepage</td></tr>

<tr><td>GET</td> <td>/:code</td> <td>Short Url</td></tr>

<tr><td>POST</td> <td>api/v1/user/</td> <td>User login</td></tr>

<tr><td>POST</td> <td>api/v1/user/signup</td> <td>User signup</td></tr>

<tr><td>GET</td> <td>api/v1/user/logout</td> <td>Log out user</td></tr>

<tr><td>DELETE</td> <td>api/v1/user/delete</td> <td>Delete user</td></tr>

<tr><td>GET</td> <td>api/v1/</td> <td>User dashboard</td></tr>

<tr><td>POST</td> <td>api/v1/</td> <td>Create short url</td></tr>

<tr><td>DELETE</td> <td>api/v1/delete</td> <td>Delete short url</td></tr>

<tr><td>PUT</td> <td>api/v1/update</td> <td>Edit url</td></tr>
</table>

## Base URL

## Contributor
- Emmanuel Eni
- eejeba@gmail.com