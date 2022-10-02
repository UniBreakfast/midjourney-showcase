# A tool to get images info from Midjourney API, and save it and images themselves locally

291 images in `localDB.json` and counting. It's over 1GB of images already!

First you'll need to download this repository (you can also clone it with git of course).

Afterwards to start it up, run `npm start` in its root directory. It will create an `images` folder in the root directory, and save all new published prompts and images in it. It will also index all the images in a `localDB.json` file. Images known before (i.e. already in the `localDB.json` file) will not be downloaded again.

If you actually don't have all known images downloaded yet, you can run `npm run fetch` to download all images mentioned in the `localDB.json` file along with the newly published. Or you can delete the `images` folder and run `npm start` to download all images. That's what will happen the first time you run the tool.

In order to accumulate more info/images you'll need to run `npm start` regularly (1-3 times a day seems enough to me 😁).

You can view downloaded images with `index.html` but you'll have to open it while running the Live Server or something like that (I use the VScode extension by the same name - Live Server). If you open [that same page online](https://unibreakfast.github.io/midjourney-showcase/) you'll see all the images mentioned in `localDB.json` stored in the cloud repo, and not the ones tool did store locally. But you can still download them just fine.
![image](https://user-images.githubusercontent.com/19654456/193405974-4b918d10-d625-463a-bbe2-ef42e3898dbc.png)
![image](https://user-images.githubusercontent.com/19654456/193406017-7fcaac3d-b8c2-4c6f-aa31-4ba576d629e3.png)
![image](https://user-images.githubusercontent.com/19654456/193406044-7a4fb427-91af-493b-a11a-570adf0d9ac4.png)
![image](https://user-images.githubusercontent.com/19654456/193406069-420f1b12-c4af-4cbf-9f39-a54bd67bd1b7.png)
