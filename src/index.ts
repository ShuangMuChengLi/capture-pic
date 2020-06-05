import {Options} from "./interface/Options"


export class CapturePic {
  isSuport: boolean
  options: Options
  video: any
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  videoStream: MediaStream
  /**
   * @param options
   */
  constructor(options: Options = {
    videoId: '',
    width: 0,
    height: 0
  }){
    if(options && options.videoId){
      this.video = document.getElementById(options.videoId)
    }else{
      this.video = document.createElement('video')
    }
    this.isSuport = false
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.options = options
  }
  init(): Promise<CapturePic>{
    return new Promise((resovle, reject)=>{
      if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia) {
        let constraints: MediaStreamConstraints
        if(this.options.width){
          constraints = {
            video : {
              width: this.options.width,
              height: this.options.height,
            }
          }
        }else{
          constraints = {
            video: true
          }
        }
        // 调用用户媒体设备, 访问摄像头
        this.getUserMedia(constraints, async (stream: MediaStream)=>{
            await this.getPhotoSuccess(stream)
            resovle(this)
          }, (error: Error)=>{
          this.getPhotoFailure(error)
          reject(this)
        })

      } else {
        this.isSuport = false
        console.error('不支持访问用户媒体')
      }
    })

  }
  getPhotoSuccess(stream: MediaStream): Promise<void>{
    return new Promise((resovle)=>{
      this.isSuport = true
      this.videoStream = stream
      // video.src = CompatibleURL.createObjectURL(stream);
      this.video.srcObject = stream
      this.video.play()
      this.video.addEventListener('loadedmetadata',  (e: any)=> {
        this.canvas.width = e.target.videoWidth
        this.canvas.height = e.target.videoHeight
        console.log(e.target.videoWidth)
        resovle()
      })
    })
  }
  // 访问用户媒体设备的兼容方法
  getUserMedia(constraints: MediaStreamConstraints, success: any, error: any): void {
    navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
  }
  getPhotoFailure(error: Error): void {
    this.isSuport = false
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
  }
  capture(): CapturePic{
    if(!this.context){
      return this
    }

    this.context.drawImage(this.video, 0, 0)
    return this
  }
  isSuportTest(): boolean{
    return this.isSuport
  }
  getBase64(isReplaceHeader = false): string{
    let picBase64 = this.canvas.toDataURL('image/jpg')
    if(isReplaceHeader){
      picBase64 = picBase64.replace(/^data:image\/(png|jpg);base64,/, '')
    }
    return picBase64
  }
  stop(): void{
    this.videoStream.getTracks().forEach(
      (track: MediaStreamTrack) =>{
        track.stop()
      }
    )
  }
}
export default CapturePic
