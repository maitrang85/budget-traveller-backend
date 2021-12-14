# Budget Traveler Backend

Backend and Database part for project Budget Traveler - Group Naturae - Fall 2021 

## Group Members:

* Hang Huynh 
* Miro Taxell 
* Trang Nguyen

## Project Description

Budget Traveler is a media sharing web aiming at connecting camping enthusiasts where they can share their favorite camping spots and thrilling stories while camping. From this platform, they can also make friends with people that share same interests, and start planning future trips together. At the present, Budget Traveler focuses on promoting marvelous camping spots and diversed camping activities available in Finland. 

Budget Traveler emloys REST architectural style as the ultimate guide for designing and developing this web app. In our envisage, this web app will require continuous connection between browser and server for the users to be updated immediately with new posts and actitvities from their friends, in addition to other user actions. Therefore, Node JS is chosen due to its efficiency in handlling huge number of requests from client. MySQL is selected as our Database Management System considering its superior performance in various aspects such as low cost, high compatibility with a wide range of programing languages and technology, around-the-clock availability and security. 

## How to install the project
1. Create the database using the script in the file databasev5.sql
2. Clone this repository to your local machine and run `npm install` to install required dependencies for the project

## Features of the project
### User stratification
Users are divided into three different groups (unauthenticated users, authenticated users and administrators) with different permissions to access to the web resources. Unauthenticated users can browse posts, read comments and see other users. Authenticated users, on the top of granted permissions for unauthenticated users, can add new posts, upload images, comment in other users' posts, like and dislike posts, modify or delete their own posts and own comments. Administrators are able to delete offending posts and comments to keep this community enjoyable to all the members.  

### Additional features
- Most populars posts are displayed on the main page for easy accessibility of useful information.
- Newest posts and comments will be placed on the main page and on the top to provide updated information.
- Campsites can be filtered according to regions in Finland.
- A map of the campsite location and its surrounding area to equip campers with necessary information for trip planning
- Responsive UI that is beautifully fitted to both desktop and mobile screens

## API Documentation
Please see the apiDoc.json file (choose 'Display rendered file' mode if viewing directly on gitlab)

