import { CapturePic } from '../src'
import { Options } from "../src/interface/Options"

let capUtil: CapturePic
const button = document.getElementById('capture')
if(button){
  button.onclick = async (): Promise<void> =>{
    if(!capUtil){
      capUtil = await new CapturePic().init()
    }
    if(!capUtil.isSuportTest()){
      console.error('不支持抓拍功能')
      capUtil = null
      return
    }
    const img: HTMLImageElement = document.getElementById('img') as HTMLImageElement
    img.src = capUtil.capture().getBase64()
    capUtil.stop()
    capUtil = null
  }
}

const preview = document.getElementById('preview')
if(preview){
  preview.onclick = async (): Promise<void> =>{
    if(!capUtil){
      capUtil = await new CapturePic({
        videoId:'video'
      } as Options).init()
    }
    if(!capUtil.isSuportTest()){
      console.error('不支持抓拍功能')
      capUtil = null
      return
    }
    const img: HTMLImageElement = document.getElementById('img') as HTMLImageElement
    img.src = capUtil.capture().getBase64()
  }
}
const stop = document.getElementById('stop')
if(stop){
  stop.onclick = (): void =>{
    if(!capUtil){
      return
    }
    capUtil.stop()
    capUtil = null
  }
}
