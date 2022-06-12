
# LPU Student Organizations

Organizations - of the students, by the students, for the students!

![Logo](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FLSO%20Bnr.jpeg?alt=media&token=e7473a9f-e36c-4c19-b731-5eaf4b04eb56)


## Problem Statement:

With a plethora of Developer Communities in College, students have a hard time finding basic information about these communities on their respective websites.

## Problem Solution:

This project offers a ‘Website for students to find all the basic information about Developer Communities in their College in one place’. Currently, the app is limited to Lovely Professional University, Punjab. The project scope is to offer our functionalities to other universities and communities over time.

## Best features:

 - Implemented Voice Control Feature (Alpha)


## Angular application File / Folder Architecture summary:

- `package.json`: consists of Node/NPM library/package/module dependencies for application development
- `node_modues` - folder consists of all installed packages
- `src/main.ts` - entry point to angular application. src/index.html
- `app/app.module.ts` - route module of application
- `app/app.component.ts` - route component of application
- `ng serve / npm start` -> main.ts (index.html) -> app.module.ts -> app.component.ts -> (app.component.html + css)


## Functionality & Concepts used :

The Website has a very simple and interactive interface which helps the users select their route flight and find its prices. Following are few Web and Firebase concepts used to achieve the functionalities in website :
<br> 
- Components : to add header, footer, search feature in the website. Header and footer components are reused in the website.
- Directives : Define how the view components are placed. It also describes the overall structure of the website components.
-  Databinding : Show the synchronisation between model and view. It populates the websites after mapping the model and view of each website page.
- Firebase Auth : To authenticate users to the website.
- Firebase Firestore database : To add Student organisation details/policies.
- Firebase Hosting - To host the website. 

# Application Link & Future Scope :

The app is currently in the Alpha testing phase for #vertos of Lovely Professional University, You can access the app : https://so-lpu.web.app/.

```bash
  https://so-lpu.web.app/
```

Once the website is fully tested and functional inside campus, we will plan it to scale it up by implementing various Google Developer Services to this app idea and collaborate across globe to create a production ready solution. We aim that by next year students across 🌐 will use this platform to list their College/University Student Clubs / Student Developer Community.
## Development server

To deploy this project run

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
  ng serve -o
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

```bash
  ng generate component component-name
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
  ng build
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```bash
  ng test
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

```bash
  ng e2e
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Screenshots

![Home Page](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FH1.png?alt=media&token=40cc1443-c622-48c9-92aa-6b222d1f0e70)

![Signup Page](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FS.png?alt=media&token=cbcb0ac2-1f00-4f93-8fda-1e96bea554b8)

![Signin Page](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FL.png?alt=media&token=246b6df8-532b-4114-947f-868ee59abab6)

![Home Page 2](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FH2.png?alt=media&token=1e97be74-18ae-423a-bbeb-d9cda8211609)

![About Page](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FA1.png?alt=media&token=2561222c-5853-4c58-807e-5f0b7509bda5)

![About Page 2](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FA2.png?alt=media&token=a545aeaf-614a-4a75-863c-e614c41d9e28)

![Policies](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FP.png?alt=media&token=974b5f1b-ad28-441b-88b5-706b61dc5028)

![Contact Page](https://firebasestorage.googleapis.com/v0/b/so-lpu.appspot.com/o/Screenshots%2FC.png?alt=media&token=4f7c98d1-1e2f-4c2e-87cb-690c5c9c7f1a)
## Run Locally

Clone the project

```bash
  git clone https://github.com/gdsclpu/LPU-Student-Organizations.git
```

Go to the project directory

```bash
  cd LPU-Student-Organizations
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run serve -o
```


## Support

For support, email gdsc@lpu.co.in or join our Slack channel https://s.gdsclpu.tech/slack.


## Authors

- [@Raman Sharma](https://www.github.com/RamanSharma100)
- [@Suraj Mani](https://www.github.com/smanitech)
- [@GDSC LPU Team](https://www.github.com/gdsclpu)
## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

