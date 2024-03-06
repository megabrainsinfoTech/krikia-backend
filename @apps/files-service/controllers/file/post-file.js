const postFile = (req, res)=> {
    // const files = req.files.map((file) => ({...file, fileURI: `${process.env.BASE_PATH}/${req.params.year}/${req.params.id}/${file.filename}`}));
  
    const file = req.file;
    console.log({...file, fileURI:  `${process.env.BASE_PATH}/${req.params.year}/${req.params.id}/${file.filename}`})
    if(req.file){
        res.json({...file, fileURI:  `${process.env.BASE_PATH}/${req.params.year}/${req.params.id}/${file.filename}`})
    }
    
}   

export default postFile