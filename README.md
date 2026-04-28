In this assessment, you have to create an automated tests suite to validate our new gaming experience.

For this purpose, you will send carts through our cart API and play games (when available) through our basic web interface.

## Assessment

In this technical assessment, you will have to create some automated test cases that validates these scenarios using **Playwright TS**:

- **Cart API** responds with a 401 with wrong authentication parameters (`auth_v`, `auth_key`, `auth_ts`, `auth_sign`)
- **Cart API** responds with a 200, without game with a `totalAti` (total all tax inclusive) lower than 50 
- **Cart API** responds with a 200, with game information with a `totalAti` (total all tax inclusive) greater than 50 
  - In this scenario, you will go to the **web game page** by follow the `baseDesktopUrl` property url and play the game through the interface: 
  - Home page: click on “Play now”
  - Game page: click on “Spin the wheel!”
  - Validate that the game has been won (text “Congrats”)

## Cart API
<aside>
⚠️ If the cartId already exists, cart API will return the existing game instead of creating a new one. We strongly recommend to use random characters in the cartId.

</aside>

- Example of wrong authentication response (status 401):

  ```json
  {
  	"error": "Request signature is not valid.",
  	"status": 401
  }
  ```

- Example of non-eligible cart response (status 200):

  ```json
  {}
  ```

- Example of eligible cart response (status 200):

  ```json
  ```

If there is a missing or a wrong authentication parameter (`auth_v`, `auth_key`, `auth_ts`, `auth_sign`), the API responds with a 401 error.

## Cart eligibility

In this current configuration, a cart is eligible to a game when the `totalAti` is greater or equals 50.


## Game web interfaces

### Home page

This is the default page of a not-already-played game. You can access to this page through the `baseDesktopUrl` property of the `POST /cart/ticket` endpoint response.

To go the game page, you have to click on the “Play now” button. Actually , this is not a button but a div:

```html
<div
	class="cta"
	data-template-type="button"
	data-template-config="screens.home.ctaButton"
	data-screen-transition="game"
>
	<h4>Play now</h4>
</div>
```

### Game page

This is the landing page of a game. To play the game, you have to click on the “Spin the wheel!” button. Actually, this is not a button but a div:

```html
<div
	class="cta"
	data-template-type="button"
	data-template-config="screens.plugin.ctaButton"
>
	<span style="font-size:6vw;">Spin the wheel!</span>
</div>
```


### Result (Won)

This is the page when the game has been won. In this configuration, every game will be winners.


### Result (Lost)

This is the page when the game has been lost. In this configuration, every game will be winners so this page will never appears.


### Already Played

This is the landing page of an already played game.



### Error Page

This page appears when a technical error occurs.

