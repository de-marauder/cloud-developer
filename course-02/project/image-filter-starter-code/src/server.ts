import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {

    try {
      // Get image_url
      const imageURL: string = req.query.image_url;
      
      // Validate URL
      if (imageURL) {
        
        // Filter image URL
        const file = await filterImageFromURL(imageURL);
        
        // Send file with response
        res.status(200).sendFile(file, (err)=>{
          if (err) {
            res.status(422).send(`Error while sending File ${err}`)
          }
          
          console.log('correct 3')
          // Delete local files
          const __dirname__: string = __dirname + '/util/tmp/' // gets directory path
          const files: string[] = fs.readdirSync(__dirname__).map((file)=>{
            return __dirname__ + file
          }); // Creates list of absolute paths to files in './util/tmp/'
          
          deleteLocalFiles(files); // delete files
        });
      } else {
        res.status(422).send("Your URL is not valid")
      }
    } catch (e) {
      res.status(422).send(`There was an error. \n${e}`)
    }
  } );

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();