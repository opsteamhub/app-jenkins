/*tracing.js*/
const dotenv = require('dotenv');
dotenv.config();
const opentelemetry = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

const traceExporter = new ConsoleSpanExporter();
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.APP_NAME,
  }),    
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    //url: "http://elasticsearch-collector:55681/v1/traces",
    url: process.env.COLLECTOR_URL,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

/*app.js*/
const express = require("express");

const PORT = parseInt(process.env.PORT || "3000");
const app = express();

app.use(express.urlencoded());

app.get('/form', function(request, response, next){

	response.send(`
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
		<div class="container">
			<h1 class="text-center mt-3 mb-3">Submit Form Data in Node.js</h1>
			<div class="card">
				<div class="card-header">Sample Form APP</div>
				<div class="card-body">
					<form method="POST" action="/">
						<div class="mb-3">
							<label>First Name</label>
							<input type="text" name="first_name" id="first_name" class="form-control" />
						</div>
						<div class="mb-3">
							<label>Last Name</label>
							<input type="text" name="last_name" id="last_name" class="form-control" />
						</div>
						<div class="mb-3">
		                	<label>Email Address</label>
		                	<input type="text" name="email_address" id="email_address" class="form-control" />
		                </div>
		                <div class="mb-3">
		                	<input type="submit" name="submit_button" class="btn btn-primary" value="Add" />
		                </div>
					</form>
				</div>
			</div>
		</div>
	`);


});

app.get("/", (req, res) => {
  res.send(process.env.NODE_MESSAGE);
});

app.post('/', function(request, response, next){

	response.send(request.body);

});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});