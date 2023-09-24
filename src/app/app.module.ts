import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { FormsModule } from '@angular/forms';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  // hostname: 'test.mosquitto.org',
  // port: 8081,
  hostname: 'a2w4ea69onhcdf-ats.iot.eu-west-3.amazonaws.com',
  port:443,
  ca:`-----BEGIN CERTIFICATE-----
  MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
  ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
  b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
  MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
  b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
  ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
  9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
  IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
  VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
  93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
  jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
  AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
  A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
  U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
  N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
  o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
  5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
  rqXRfboQnoZsG4q5WTP468SQvvG5
  -----END CERTIFICATE-----
  `,
  cert:`-----BEGIN CERTIFICATE-----
  MIIDWjCCAkKgAwIBAgIVAIRogWQpaKpyHbGvppA+rMkrE3g3MA0GCSqGSIb3DQEB
  CwUAME0xSzBJBgNVBAsMQkFtYXpvbiBXZWIgU2VydmljZXMgTz1BbWF6b24uY29t
  IEluYy4gTD1TZWF0dGxlIFNUPVdhc2hpbmd0b24gQz1VUzAeFw0yMzA5MjIxMDU5
  NTVaFw00OTEyMzEyMzU5NTlaMB4xHDAaBgNVBAMME0FXUyBJb1QgQ2VydGlmaWNh
  dGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAZrg8Sp6wuKg3j6BR
  Cw/fe+JZcWE6jq5r2k9pAzleKVuhpK4DbUqk2arqQaEhs/nvDZf5gWfcL+s/fcNZ
  iQG9EW+jaoWC9b43N7z6z0QpDHmDaT3TWUMMcE9e6+0b+zxZYDdLWkJu9rOh69mL
  WCty8pim0SehXY1HH16MBiulLeM9vZBOD1k9MHCZjMlhk6avjYKCYzJVLu4ECZD1
  lRCXc5dKpeWOGK6Ohq3enbMzvhLuppMmB7mKJRrql+YVKq93rcwhQiD+e6fllDcN
  SfwA7dRZqh5irmIchZ8QWBcd7R2HVEUbGc3vbN0kvx2M+G9xI1pgEY4TP8mDvWMk
  izoPAgMBAAGjYDBeMB8GA1UdIwQYMBaAFM91tf4hgOHfv/xbSBmPq3vK4yCWMB0G
  A1UdDgQWBBSd8NLCKNEtUrQ3rzmGdk5wGen36TAMBgNVHRMBAf8EAjAAMA4GA1Ud
  DwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAQEAFG0KgZuHi6ozKRi6GbNwPzpg
  GVLX+mIddGTAafqdzXQ6fH/ar0u9GYoc2mCHgyUuZUI0a88KDUle5lUoq+zIYkuz
  r6IC+uy56c7N4S99uyDCsBSMvUwyUblpT7nwkjSKRj4NyV29cw4XcNypyPMpxTEl
  tEOzDN2mKYV2bKZjbEwo5ZCOBsSEkYOgxPFj9R+RXGzSZ1+RJIKzWqy4my2hKPZS
  Wjww58YSKD7tvex2/uDP13ac0wqA1DSg1Am652RXia8pxQb1DjM1CM6+VWrnUyd8
  zD7WeU/nClADvXAGmhzBVksgKbHR4U89s+boWb18tHVGyinW4sVYXRPpWzhktw==
  -----END CERTIFICATE-----
  `,
  key: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwGa4PEqesLioN4+gUQsP
  33viWXFhOo6ua9pPaQM5XilboaSuA21KpNmq6kGhIbP57w2X+YFn3C/rP33DWYkB
  vRFvo2qFgvW+Nze8+s9EKQx5g2k901lDDHBPXuvtG/s8WWA3S1pCbvazoevZi1gr
  cvKYptEnoV2NRx9ejAYrpS3jPb2QTg9ZPTBwmYzJYZOmr42CgmMyVS7uBAmQ9ZUQ
  l3OXSqXljhiujoat3p2zM74S7qaTJge5iiUa6pfmFSqvd63MIUIg/nun5ZQ3DUn8
  AO3UWaoeYq5iHIWfEFgXHe0dh1RFGxnN72zdJL8djPhvcSNaYBGOEz/Jg71jJIs6
  DwIDAQAB
  -----END PUBLIC KEY-----
  `,
  clientId:"Mobile_App-0x5c1a7ec1",
  connectOnCreate:true,
  protocol:'wss'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    FormsModule,
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
