// import * as Oss from 'ali-oss';
// import OSS from 'ali-oss';

// class AliOss {
//   private oss: OSS;

//   constructor() {
//     this.oss = new Oss({
//     });
//   }

//   public async putOssFile(localPath: string): Promise<string> {
//     let res: any;
//     const fileName = Date.now() + '.png';
//     try {
//       res = await this.oss.put(fileName, localPath);
//       // 将文件设置为公共可读
//       await this.oss.putACL(fileName, 'public-read');
//     } catch (error) {
//       console.log(error);
//     }
//     return res.url;
//   }
// }

// const aliOss = new AliOss();
// export default aliOss;
