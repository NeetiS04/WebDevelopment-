http =require("http")
fs=require("fs")
path=require("path")
const main=(req,res)=>{
  const urlPath=new URL(req.url,`http://${req.headers.host}`);
  const pathname=urlPath.pathname;
  const filename=urlPath.searchParams.get("fname");
  const content=urlPath.searchParams.get("content");
  const firDir=path.join(__dirname,"/files")
  if(!filename){
    res.writeHead(404);
    res.end("File name not pass!");
    return;
  }
  const filepath=path.join(firDir,filename)
//   http://localhost:3000/read?fname=abc.txt&&content="this is file content"
if(pathname==="/delete" && req.method==="DELETE"){
     if(fs.existsSync(filepath)){
             fs.unlink(filepath,(error)=>{
                  if(error){
            res.writeHead(400);
            res.end("File not deleted!");
            return;
           }
           res.end("File deleted successfully!")
             })
     } else {
       res.writeHead(200);
       res.end("File already deleted!");
       return;
     }
}
if(pathname==="/append" && req.method==="PUT"){
   if(!content){
    res.writeHead(404);
    res.end("File content not pass!");
    return;
    }
      fs.appendFile(filepath,content||"","utf8",(error)=>{
           if(error){
            res.writeHead(404);
            res.end("Not able to append in file!");
            return;
           }
           res.end("File updated successfully!")
      })
    } 

if(pathname==="/write" && req.method==="POST")
{
    if(!content){
    res.writeHead(200);
    res.end("File content not pass!");
    return;
    }
    if(!fs.existsSync(filepath)){
      fs.writeFile(filepath,content||"",(error)=>{
           if(error){
            res.writeHead(204);
            res.end("Not able to write in file!");
            return;
           }
           res.end("File write successfully!")
      })
    } else {
    res.writeHead(200);
    res.end("File already exists!");
    return;
    }

}
if(pathname==="/read" && req.method==="GET"){
    fs.readFile(filepath,"utf8",(error,data)=>{
        if(error){
             res.writeHead(404,{"content-type":"application/json"})
             res.end(JSON.stringify({"error":"File not found!"}));
             return;
        }
        res.writeHead(200,{"content-type":"text/html"})
        res.end("<pre>"+data+"</pre>")
    })
  }
}
const server=http.createServer(main);
server.listen(3000,(error)=>{
    if(error){
        console.log(error)
    }
    console.log("Running on http://127.0.0.1:3000")
})