# Client UI

## App-Frame

Check: https://getbootstrap.com/docs/4.3/getting-started/introduction/

```
<head>
  <meta charset="utf-8" />
  <title>PlutoWeb-23</title>

  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Roboto:300,400,700&display=swap"
    rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />


</head>

<body>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
    integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
    integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous">
  </script>

  <div class="container" style="margin-top:20px">
     

  </div>
  
</body>
```



## Add Nav Bar

## Add Areas

| Area         |
| ------------ |
| areaSignIn   |
| areaPost     |
| areaMessages |



We have the following areas:

| Area         | Action Elements                                              |      |
| ------------ | ------------------------------------------------------------ | ---- |
| areaSignIn   | ButtonSignIn<br />ButtonCreateAccount<br />signInEmail<br />signInPassword |      |
| areaPost     |                                                              |      |
| areaMessages |                                                              |      |

| Area       | Action Elements (id) |
| ---------- | -------------------- |
| areaSignIn | ButtonSignIn         |
|            | ButtonCreateAccount  |
|            | signInEmail          |
|            | signInPassword       |
| areaPost   |                      |

### AreaSignIn

### AreaPost

### Area Messages

## index.js

### State Object

```javascript
  let state = {
      signedIn: false,
      isVisibleAreaSignIn: true,
      isVisibleAreaPost: false,
      isVisibleAreaMessages: false 
  }
```

### AreaManager





### Add Listener to Navbar Elements

#### Structure

```javascript
navSignIn.addEventListener('click', () => {
      // ...
});
```

#### SignIn-Listener

