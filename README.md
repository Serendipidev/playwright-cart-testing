In this assessment, you have to create an automated tests suite to validate our new gaming experience.

For this purpose, you will send carts through our cart API and play games (when available) through our basic web interface.

## Assessment

In this technical assessment, you will have to create some automated test cases that validates these scenarios using **Playwright TS**:

- **Cart API** responds with a 401 with wrong authentication parameters (`auth_v`, `auth_key`, `auth_ts`, `auth_sign`)
- **Cart API** responds with a 200, without game with a `totalAti` (total all tax inclusive) lower than 50 (see: [https://luckycart.notion.site/QA-Engineer-Technical-Assessment-76c4ae6dcd104b0baee707973d004409#9299c51852ac4a32a73d0b6d1d5e0cea](https://www.notion.so/QA-Engineer-Technical-Assessment-34c9d2b4f984804faafcc97a7ece0b39?pvs=21))
- **Cart API** responds with a 200, with game information with a `totalAti` (total all tax inclusive) greater than 50 (see:[https://www.notion.so/luckycart/QA-Engineer-Technical-Assessment-d27fe4c2f6f54cce820c2bb873c8455c?source=copy_link#106252fcf06c4fccb1a86ccc72da7f90](https://www.notion.so/QA-Engineer-Technical-Assessment-34c9d2b4f984804faafcc97a7ece0b39?pvs=21))
    - In this scenario, you will go to the **web game page** by follow the `baseDesktopUrl` property url and play the game through the interface: (see: [https://www.notion.so/luckycart/QA-Engineer-Technical-Assessment-d27fe4c2f6f54cce820c2bb873c8455c?source=copy_link#a71e55461e734f188ed4109e8db0b4ba](https://www.notion.so/QA-Engineer-Technical-Assessment-34c9d2b4f984804faafcc97a7ece0b39?pvs=21))
    - Home page: click on “Play now”
    - Game page: click on “Spin the wheel!”
    - Validate that the game has been won (text “Congrats”)

## Cart API

To send a cart, perform an HTTP POST request to `https://api.luckycart.com/cart/ticket` endpoint with this JSON:

```json
{
    "cartId": "not_eligible_test_1",
    "totalAti": 30.00,
    "shopperId": "not_eligible_test_1",
    "shopperEmail": "not_eligible_test_1@luckycart.com",
    "auth_v": "2.0",
    "auth_key": "tVIoa1S6",
    "auth_ts": "1640991600",
    "auth_sign": "c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30"
}
```

| Property | Type | Comments |
| --- | --- | --- |
| cartId | String | Cart unique identifier (use random string to avoid collision) |
| totalAti | Number | Total All Tax Included |
| shopperId | String | Shopper unique identifier |
| shopperEmail | String | Shopper email address |
| auth_v | String | Always “2.0” |
| auth_key | String | Always “tVIoa1S6” |
| auth_ts | String | Always “1640991600” |
| auth_sign | String | Always “c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30” |

This API responds with game information if the cart is eligible:

- ticket: this is a unique code per game
- baseDesktopUrl: this is the URL of the game page

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
    {
    	"ticket": "NVEX-EZIC-UCNB-DDYK",
    	"mobileUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/mobile/url",
    	"tabletUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/tablet/url",
    	"desktopUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/desktop/url",
    	"baseMobileUrl": "https://go.luckycart.com/mobile/NVEX-EZIC-UCNB-DDYK",
    	"baseTabletUrl": "https://go.luckycart.com/tablet/NVEX-EZIC-UCNB-DDYK",
    	"baseDesktopUrl": "https://go.luckycart.com/lc__team__qa_2/GPdIFo/play/NVEX-EZIC-UCNB-DDYK"
    }
    ```


If there is a missing or a wrong authentication parameter (`auth_v`, `auth_key`, `auth_ts`, `auth_sign`), the API responds with a 401 error.

## Cart eligibility

In this current configuration, a cart is eligible to a game when the `totalAti` is greater or equals 50.

- Example of non-eligible cart:

    ```bash
    curl --request POST 'https://api.luckycart.com/cart/ticket' --header 'Content-Type: application/json' --data-raw '
    {
        "cartId": "not_eligible_test_1",
        "totalAti": 30.00,
        "shopperId": "not_eligible_test_1",
        "shopperEmail": "not_eligible_test_1@luckycart.com",
        "auth_v": "2.0",
        "auth_key": "tVIoa1S6",
        "auth_ts": "1640991600",
        "auth_sign": "c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30"
    }'
    # Response
    # {}
    ```

- Example of eligible cart:

    ```bash
    curl --request POST 'https://api.luckycart.com/cart/ticket' --header 'Content-Type: application/json' --data-raw '
    {
        "cartId": "eligible_test_2",
        "totalAti": 60.00,
        "shopperId": "eligible_test_2",
        "shopperEmail": "eligible_test_2@luckycart.com",
        "auth_v": "2.0",
        "auth_key": "tVIoa1S6",
        "auth_ts": "1640991600",
        "auth_sign": "c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30"
    }'
    # Response
    #{
    #	"ticket": "NVEX-EZIC-UCNB-DDYK",
    #	"mobileUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/mobile/url",
    #	"tabletUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/tablet/url",
    #	"desktopUrl": "https://api.luckycart.com/replacement/NVEX-EZIC-UCNB-DDYK/desktop/url",
    #	"baseMobileUrl": "https://go.luckycart.com/mobile/NVEX-EZIC-UCNB-DDYK",
    #	"baseTabletUrl": "https://go.luckycart.com/tablet/NVEX-EZIC-UCNB-DDYK",
    #	"baseDesktopUrl": "https://go.luckycart.com/lc__team__qa_2/GPdIFo/play/NVEX-EZIC-UCNB-DDYK"
    #}
    ```


## Game web interfaces

### Home page

This is the default page of a not-already-played game. You can access to this page through the `baseDesktopUrl` property of the `POST /cart/ticket` endpoint response.

To go the game page, you have to click on the “Play now” button. Actually , this is not a button but a div:

```html
<div class="cta" data-template-type="button" data-template-config="screens.home.ctaButton" data-screen-transition="game">
  <h4>Play now</h4>
</div>
```

![Screenshot 2022-02-02 at 15.44.59.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6a76536f-4e10-4576-a221-a9fd299b97a5/Screenshot_2022-02-02_at_15.44.59.png)

### Game page

This is the landing page of a game. To play the game, you have to click on the “Spin the wheel!” button. Actually, this is not a button but a div:

```html
<div class="cta" data-template-type="button" data-template-config="screens.plugin.ctaButton">
  <span style="font-size:6vw;">Spin the wheel!</span>
</div>
```

![Screenshot 2022-02-02 at 15.45.06.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/16db8b41-a0a0-42f8-9fe3-6cbc8a5c408b/Screenshot_2022-02-02_at_15.45.06.png)

### Result (Won)

This is the page when the game has been won. In this configuration, every game will be winners.

![Screenshot 2022-02-02 at 15.45.23.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d921876e-0b05-4374-b2f2-152654746986/Screenshot_2022-02-02_at_15.45.23.png)

### Result (Lost)

This is the page when the game has been lost. In this configuration, every game will be winners so this page will never appears.

![Screenshot 2022-02-02 at 15.46.27.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/83ee675a-1283-4750-aaf3-0d417b7daba3/Screenshot_2022-02-02_at_15.46.27.png)

### Already Played

This is the landing page of an already played game.

![Screenshot 2022-02-02 at 15.46.54.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20015ea5-310a-434c-834b-a8fdfe51065b/Screenshot_2022-02-02_at_15.46.54.png)

### Error Page

This page appears when a technical error occurs.

![Screenshot 2022-02-02 at 15.47.25.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/52bbbad1-f2ad-4a98-a3b7-b5706efcf00c/Screenshot_2022-02-02_at_15.47.25.png)