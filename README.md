# XM - Express Mock

Easily create a test server with mock responses from a JSON file blazingly fast.

## Installation

With npm global install

```sh
npm install -g @elliot40404/xm
xm <path_to_your_config.json>
```

Clone the repo and manully add

```sh
git clone https://github.com/elliot40404/xm
cd xm
npm ci
npm prune --prod
npm install .
```

## USAGE

Using npx

```sh
npx @elliot40404/xm <path_to_your_config.json>
```

Using npm global install or manual link

```sh
xm <path_to_your_config.json>
```

## CONFIG

Default Address is `127.0.0.1`

Default Port is `6969`

Example file

```json
{
    "ip": "localhost",
    "port": 7777,
    "routes": [
        {
            "path": "/hello",
            "method": "get",
            "status": 200,
            "response": {
                "data": "hello friend!"
            }
        },
        {
            "path": "/hello",
            "method": "post",
            "status": 201,
            "headers": {
                "Content-Type": "application/json",
                "X-My-Header": "My-Value"
            },
            "response": {
                "data": "You made a new friend"
            }
        }
        {
            "path": "/change",
            "method": "put",
            "status": 403,
            "response": {
                "data": "You cannot do this!"
            }
        }
    ]
}
```

### `ip` and `port` are optional top level parameters if not provided via the config defaults to `127.0.0.1` and `6969` respectively

### `routes` is a mandatory top level field

#### Route Block breakdown

```json
{
    "path": "/hello", // *Required* Maps to http://ip/path
    "method": "post", // *Required* Specifies the HTTP method
    "status": 201, // *Optional* Defaults to 200
    "headers": {
        // *Optional*
        "Content-Type": "application/json"
    },
    "response": {
        // *Required* Can be any valid json value
        "data": "You made a new friend"
    }
}
```

| Parameter | Required | Default                 | Description   |
| --------- | -------- | ----------------------- | ------------- |
| path      | Yes      | -                       | url path      |
| response  | Yes      | -                       | return body   |
| method    | Yes      | -                       | http method   |
| status    | No       | 200                     | response code |
| headers   | No       | Default Express Headers | http headers  |

## LICENSE

MIT
