import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
// import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Auth, Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, AfterViewInit {
  // TODO: add a chart to show the accelerometer data
  // TODONE: add a 3d visualisation to test MPU To Angles/Pos algorithm
  // TODO: add a 2d visualisation to test Pressure Map Averaging algorithm

  Name: string = '';
  name: string = '';
  text: string = '';
  tab: number = 0;
  rol: boolean = true;
  list: { user: string; msg: string }[] = new Array(0); //[{user:"Me",msg:"Hello ----------------------------------- MQTT"},{user:"Not Me",msg:"hello ------------------------------------------- there"}];
  Rmpudata: {
    Sx: number;
    Sy: number;
    Sz: number;
    Qx: number;
    Qy: number;
    Qz: number;
    Qw: number;
  } = { Sx: 0, Sy: 0, Sz: 0, Qx: 0, Qy: 0, Qz: 0, Qw: 0 };
  Rprsdata: number[] = [];

  Lmpudata: {
    Sx: number;
    Sy: number;
    Sz: number;
    Qx: number;
    Qy: number;
    Qz: number;
    Qw: number;
  } = { Sx: 0, Sy: 0, Sz: 0, Qx: 0, Qy: 0, Qz: 0, Qw: 0 };
  Lprsdata: number[] = [];
  obs_chat!: Subscription;
  obs_sensors!: Subscription;
  count: boolean = false;
  counts: number = 0;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('thecanvas') private myCanvas!: ElementRef;
  @ViewChild('prscanvas') private prscanvas!: ElementRef;
  camera!: THREE.PerspectiveCamera;
  get canvas(): HTMLCanvasElement {
    return this.myCanvas.nativeElement;
  }

  get pcanvas(): HTMLCanvasElement {
    return this.prscanvas.nativeElement;
  }

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;

  async ngAfterViewInit() {
    if (this.tab == 1) {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x404040);

      let somila: THREE.Group<THREE.Object3DEventMap> = await new Promise<
        THREE.Group<THREE.Object3DEventMap>
      >((resolve, reject) => {
        this.scene;
        let loader = new GLTFLoader();

        loader.load(
          'assets/somila.glb',
          function (gltf) {
            console.log('loaded');
            resolve(gltf.scene);
          },
          undefined,
          function (error) {
            console.error(error);
            reject(error);
          }
        );
      });
      let plight = new THREE.PointLight(0xffffff, 100, 0, 1);
      plight.position.set(50, -50, 50);
      this.scene.add(plight);
      let ambientLight = new THREE.AmbientLight(0x999999);
      this.scene.add(ambientLight);

      let box = new THREE.Box3().setFromObject(somila);
      let trnvec = new THREE.Vector3();
      trnvec = box.getCenter(trnvec);
      console.log(trnvec);
      somila.scale.set(0.02, 0.02, 0.02);
      // this.camera.quaternion.copy(somila.quaternion);

      this.scene.add(somila);
      let aspectRatio = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(1, aspectRatio, 1, 1000);
      this.camera.position.z = 400;

      // start render loop;
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      let comp: AppComponent = this;
      let x = 0;
      (function render() {
        requestAnimationFrame(render); // recursive loop
        somila.children[0].position.set(-trnvec.x, -trnvec.y, -trnvec.z);
        let h = new THREE.Quaternion(
          comp.rol == true ? -comp.Rmpudata.Qy : -comp.Lmpudata.Qy,
          comp.rol == true ? comp.Rmpudata.Qz : comp.Lmpudata.Qz,
          comp.rol == true ? -comp.Rmpudata.Qx : -comp.Lmpudata.Qx,
          comp.rol == true ? comp.Rmpudata.Qw : comp.Lmpudata.Qw
          // comp.Lmpudata.Qy,
          // comp.Lmpudata.Qz,
          // comp.Lmpudata.Qx,
          // comp.Lmpudata.Qw
        );
        // let h = new THREE.Quaternion(comp.mpudata.Qx,comp.mpudata.Qz,-comp.mpudata.Qy,comp.mpudata.Qw);
        h = h.normalize();
        somila.setRotationFromQuaternion(h);
        // somila.rotateX(0.01)
        // somila.rotateY(-0.01)
        // somila.rotateZ(0.02);
        comp.renderer.render(comp.scene, comp.camera);
      })();
    }
    if (this.tab == 2) {
      const ctx = this.pcanvas.getContext('2d');
      if (ctx == null) {
        console.log('Context is Null!!!!');

        return;
      }

      setInterval(() => {
        const imgData = ctx.createImageData(
          this.pcanvas.clientWidth,
          this.pcanvas.clientHeight
        );
        for (let i = 0; i < imgData.data.length; i += 4) {
          let x = 0;
          let y = 0;
          x = Math.floor(i / 4 / this.pcanvas.clientWidth);
          y = (i / 4) % this.pcanvas.clientWidth;

          if (
            255 /
              Math.pow(
                Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y - 100, 2)),
                2
              ) >=
            0.05
          ) {
            imgData.data[i + 0] =
              2000 /
              Math.pow(
                Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y - 100, 2)),
                2
              );
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 255;
          } else {
            imgData.data[i + 0] =
              2000 /
              Math.pow(
                Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y - 100, 2)),
                2
              );
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }, 20);
    }
  }

  constructor() {
    //private MqttSrv: MqttService) {
    this.tab = Number(localStorage.getItem('tab'));
    // console.log("Current MQtt State",MqttSrv.state);
    // this.obs_chat = MqttSrv.observe('ESP32SCIATECH-thisNthat').subscribe(
    //   (msg) => {
    //     let str: string = msg.payload.toString();
    //     let user: number = str.indexOf(':');
    //     if (user < 0) {
    //       this.list.push({ user: 'Anonymous', msg: str });
    //     } else {
    //       this.list.push({
    //         user: str.slice(0, user),
    //         msg: str.slice(user + 1),
    //       });
    //     }
    //     this.scrollToBottom();
    //   }
    // );
    //
    // this.obs_sensors = MqttSrv.observe(
    //   'InsoleR-MPU-0x5c1a7ec1'
    //   ).subscribe((msg) => {
    //     console.log("gotten");
    //
    //   let obj = JSON.parse(msg.payload.toString());
    //   if (obj.Type == 'MPU') {
    //     if (this.count) {
    //       this.counts++;
    //       return;
    //     }
    //     this.mpudata = obj;
    //   } else if (obj.Type == 'PRS') {
    //     if (this.count) {
    //       return;
    //     }
    //     this.prsdata = obj;
    //   }
    // });

    Amplify.configure({
      Auth: {},
      aws_cognito_identity_pool_id:
        'eu-west-3:9ee4bdc0-a074-4e09-af33-c33240d95588',
      aws_cognito_region: 'eu-west-3',
    });

    // Assume the IAM role associated with the Cognito Identity Pool
    Auth.configure({
      identityPoolId: 'eu-west-3:9ee4bdc0-a074-4e09-af33-c33240d95588',
      region: 'eu-west-3',
    });
    console.log('Trying to get Creds');

    Auth.currentCredentials()
      .then((credentials) => {
        console.log('Gotten Creds');

        // Now you have temporary AWS credentials to access AWS services
        // Use these credentials to subscribe to AWS IoT
        PubSub.addPluggable(
          new AWSIoTProvider({
            aws_pubsub_region: 'eu-west-3',
            aws_pubsub_endpoint:
              'wss://a2w4ea69onhcdf-ats.iot.eu-west-3.amazonaws.com/mqtt',
          })
        );

        PubSub.configure({
          aws_pubsub_region: 'eu-west-3',
          credentials: credentials,
        });

        console.log('Subscribing ...');
        // Now, you can subscribe to AWS IoT
        // PubSub.subscribe('InsoleR-MPU-0x5c1a7ec1').subscribe({
        //   next: (data) => {
        //     let obj: any = data.value;
        //     if (obj.Type == 'MPU') {
        //       if (this.count) {
        //         this.counts++;
        //         return;
        //       }
        //       this.mpudata = obj;
        //     } else {
        //       console.log(
        //         'Message received on InsoleR-MPU-0x5c1a7ec1:',
        //         JSON.stringify(obj)
        //       );
        //     }
        //   },
        //   error: (error) => {
        //     console.error(
        //       'Error subscribing to InsoleR-MPU-0x5c1a7ec1:',
        //       error
        //     );
        //   },
        // });
        //
        // PubSub.subscribe('InsoleR-PSR-0x5c1a7ec1').subscribe({
        //   next: (data) => {
        //     let obj: any = data.value;
        //     if (obj.Type == 'PRS') {
        //       if (this.count) {
        //         return;
        //       }
        //       this.prsdata = obj;
        //     } else {
        //       console.log(
        //         'Message received on InsoleR-PSR-0x5c1a7ec1:',
        //         JSON.stringify(obj)
        //       );
        //     }
        //   },
        //   error: (error) => {
        //     console.error(
        //       'Error subscribing to InsoleR-PSR-0x5c1a7ec1:',
        //       error
        //     );
        //   },
        // });
        let h = 0;
        PubSub.subscribe('InsoleR-0x5c1a7ec1').subscribe({
          next: (data) => {
            let mobj: any = (data.value as any).MPU;
            let tobj: any = (data.value as any).Timestamp;
            let pobj: any = (data.value as any).PSR;

            if (mobj === undefined && pobj == undefined) {
              console.log(
                'Message received on InsoleR-0x5c1a7ec1:',
                JSON.stringify(data.value)
              );
              return;
            }
            if (this.count) {
              this.counts++;
              return;
            }
            if (tobj !== undefined) tobj;
            if (mobj !== undefined) {
              // this.Lmpudata=this.Rmpudata;
              this.Rmpudata = mobj;
            }
            if (pobj !== undefined) {
              this.Rprsdata = pobj;
            }
          },
          error: (error) => {
            console.error(
              'Error subscribing to InsoleR-PSR-0x5c1a7ec1:',
              error
            );
          },
        });

        PubSub.subscribe('InsoleL-0x5c1a7ec1').subscribe({
          next: (data) => {
            let mobj: any = (data.value as any).MPU;
            let tobj: any = (data.value as any).Timestamp;
            let pobj: any = (data.value as any).PSR;

            if (mobj === undefined && pobj == undefined) {
              console.log(
                'Message received on InsoleR-0x5c1a7ec1:',
                JSON.stringify(data.value)
              );
              return;
            }
            if (this.count) {
              this.counts++;
              return;
            }
            if (tobj !== undefined) tobj;
            if (mobj !== undefined) {
              // this.Rmpudata=this.Lmpudata;
              this.Lmpudata = mobj;
            }
            if (pobj !== undefined) {
              this.Lprsdata = pobj;
            }
          },
          error: (error) => {
            console.error(
              'Error subscribing to InsoleR-PSR-0x5c1a7ec1:',
              error
            );
          },
        });
      })
      .catch((error) => {
        console.error('Error getting credentials:', error);
      });
  }

  set_tab(i: number) {
    this.tab = i;
    localStorage.setItem('tab', i.toString());
    if (i == 1 || i == 2) {
      this.ngAfterViewInit();
    }
  }

  countthem() {
    this.count = false;
    this.counts = 0;
    this.count = true;
    setTimeout(() => {
      this.count = false;
    }, 1000);
  }

  sendit() {
    // this.MqttSrv.unsafePublish(
    //   'ESP32SCIATECH-thisNthat',
    //   !!this.Name ? this.Name + ': ' + this.text : this.text
    // );
  }

  changeit() {
    this.Name = this.name;
  }

  formatnum(num: number, apnt: number, bpnt: number) {
    let str: string = '';
    if (apnt <= 0) {
      str = Math.floor(num).toString();
      str =
        str.at(0) == '-'
          ? '-' + str.slice(1).padStart(bpnt, '0')
          : str.padStart(bpnt, '0');
    } else {
      str = num.toFixed(apnt);
      str =
        str.at(0) == '-'
          ? '-' +
            str.slice(1, -1 - apnt).padStart(bpnt, '0') +
            str.slice(-apnt - 1)
          : str.slice(0, -1 - apnt).padStart(bpnt, '0') + str.slice(-apnt - 1);
    }
    return str;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this.obs_chat.unsubscribe();
    this.obs_sensors.unsubscribe();
  }
}
