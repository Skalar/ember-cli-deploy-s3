# ember-cli-deploy-s3

ember-cli addon that deploys ember apps to S3 with optional Route 53 configuration.

## Installation

In your ember app directory

```bash
npm install Skalar/ember-cli-deploy-s3 --save-dev
```

## Configuration

Environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set. [direnv](http://direnv.net) does this well.

## Usage

### Examples

#### Vanilla bucket

```bash
$ ember deploy-s3 mybucket --region eu-west-1

version: 0.1.4
valid watchman found, version: [3.0.0]
ℹ  AWS Region: eu-west-1
ℹ  Bucket: mybucket
ℹ  Bucket does not exists.
✔  S3 bucket created.
✔  Bucket configured as website.
Built project successfully. Stored in "dist/".
✔  Files synced to bucket.

ℹ  S3 url:     http://mybucket.s3-website-eu-west-1.amazonaws.com
```

#### Custom domain with Route 53
```bash
$ ember deploy-s3 demo.myapp.com --region eu-west-1 --route53

version: 0.1.4
valid watchman found, version: [3.0.0]
ℹ  AWS Region: eu-west-1
ℹ  Bucket: demo.myapp.com
ℹ  Bucket does not exists.
✔  S3 bucket created.
✔  Bucket configured as website.
ℹ  No compatible existing Route 53 zone found.
✔  Route 53 hosted zone created (myapp.com).
⚠  You have to setup the following NS records for demo.myapp.com:
* ns-58.awsdns-07.com
* ns-1437.awsdns-51.org
* ns-1888.awsdns-44.co.uk
* ns-740.awsdns-28.net
✔  Route 53 record set configured.
Built project successfully. Stored in "dist/".
✔  Files synced to bucket.

ℹ  S3 url:     http://demo.myapp.com.s3-website-eu-west-1.amazonaws.com
ℹ  Custom url: http://demo.myapp.com
```

### Options
```bash
$ ember deploy-s3 --help

ember deploy-s3 <s3-bucket> <options...>
  Deploys app to S3 bucket. Creates and configures specified bucket.
  aliases: s3
  --build (Default: true)
  --environment (Default: production)
  --output-path (Default: dist/)
  --region (Default: eu-west-1)
  --route53
  --route53-domain
  --force-bucket-config
  --delete-removed
```


## Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`


### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
