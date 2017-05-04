[33m2ca8230[m reselect images working
[33m524b542[m added additional canvas for images
[33md861226[m fabric js image canvas basic functionality
[33m460adc9[m working annotate and image modules
[33mf179c0f[m added classes for annotate and image modules with base class
[33m4490b28[m added new image module class
[33m73fc1c7[m added frontend and backend security verification of jpeg image
[33m9bc7b96[m working image upload and snpshot function
[33m11bb488[m upload img stage 1 functionality
[33m0fa3b5f[m modal for image upload and snapshot updated
[33ma5b70df[m temp fix for bug delivering templates via ajx
[33m930f106[m moved create new note set function moved into show modal function
[33m00a4814[m tab switch to active note on create new
[33mcb03c0c[m hyperlink added to title in my notes
[33mc69feba[m posts retrieved and inserted into sortable data table
[33ma6b5acd[m fixed bug bootstrap datatable dropdown conflict
[33m39a385c[m added datatables library
[33mc2de468[m added notes module class added html for my notes layout
[33m9023f4f[m separate uploads directory for users in 3d-notes in wp content uplodas dir
[33m6a57673[m added function to switch tabs
[33m40a4161[m static pages deleted on deactivation. excerpt added automatically to static pages
[33m3f69629[m actions modal update existing link working
[33mc9a46ba[m switched actions modal to inbuilt modal
[33mbd71972[m switch to own modal for editing actions
[33ma89a3ae[m added action data object options settings to scene link
[33m3199f21[m add and remove linked scenes working
[33m71e6912[m edit link scene box opens in editor mode
[33m0862be7[m load action title into drop down container working
[33mf4bbdc6[m action title enabled via link scene button tiny mce
[33m38d8e29[m actions linked to text
[33m841d225[m added separate css class for tiny mce editor
[33md74b314[m functionless tinymce linkscene button
[33m3ff490a[m added tiny mce plugin to link actions to text
[33m9f896a3[m added aspect ratio snapshot for 4:3 and 1:1
[33m3bfbb23[m added annotate mode div
[33m5994898[m added delete button to annotation modal
[33m84d2a16[m added property to annotation on creation to prevent deletion if modal cancelled
[33m2cf8101[m annotations load from scene upon action navigation
[33m09b5b64[m added method to add annotation to container
[33m6480a94[m added annotations label to track num annotaations2
[33mb9ace13[m added new functino to show specific modals
[33mce8e730[m added function load annotations
[33me279c7e[m annotations list loaded for first action item on first load
[33m88b792e[m create and edit notations working
[33mf269c55[m ability to add annotations programmatically
[33m265e35c[m added toggled for canvas
[33m6aac4eb[m added custom canvas overlay
[33m25b2ad6[m changed num cols for note images
[33mb2c7c40[m refactored loading methods
[33m4b902f2[m delete images via rest api working
[33m1b41c46[m function to add listeners to image toolbar working
[33m073eb2a[m removed tooltip from toolbar. only admin can view image edit toolbar
[33mf1b53e9[m added toolbar lib for image editing
[33m9382158[m meta properties added to image snapshot
[33md85d1d3[m added image properties modal
[33me0cfacb[m added sqipebox jquery plugin for lightbox gallery
[33m1f2b0e9[m images saved and restored via post meta
[33m79737ec[m medium image size obtained upon image capture
[33m696bfe0[m image upload and resize to wp content uploads dir
[33mb7e3a03[m bugfix: human ui not updated if scene not first
[33m4c2e2bc[m tinymce working config. all formatting works
[33m615e967[m support for excerpts added to post types
[33m9132712[m saving or creating new notes auto publish
[33m0ab3bd7[m added default title for notes dashboard
[33m86e0d0d[m s2 member level 2 notes publish to user-notes working
[33m8774952[m global varibales for static post id set on init hook
[33ma01e3c0[m refactored tours to notes. static pages created on plugin activation
[33m37a1831[m level 1 s2 member able to create and publish and edit 3d notes
[33me351e32[m layout file for 3d tours set to prevent unauthorised users from editing any set of notes
[33m7525ee0[m notes dashboard creates new notes item upon save or edit title
[33m874ebac[m added context property to app globals
[33mf46929f[m new post created in db when dashboard loaded
[33mba1bbdc[m added rest support for 3d tours post type
[33m4205609[m added clear active notes function JS frontend, no db write
[33m3786833[m added main toolbar nav
[33meae3af6[m fixed bug table not created for notes on activation
[33md040988[m added function to edit post title
[33mf2a8c65[m js function to edit post title
[33m1c2cf89[m added modal for image upload
[33mea5131e[m 3d body only post layout set
[33me6537dd[m updated layout template
[33m4514359[m tinymce working offline
[33m5318fec[m added tinymce librar. added function to save note if offline
[33m1928424[m added snapshot to timeline
[33m2df91ad[m added snapshot feature
[33m4ff5c14[m updated preset urls
[33mc6cf5e2[m added humanui config params for admin and user
[33m530fab7[m no title default set
[33m1dae1f5[m fixed bug first scene not saving if brand new tour created. save occurrs immediately on load now
[33m3d36a39[m changed dropdown to drop up. correct data-structure typos
[33mcb206ec[m added head bookmarks
[33me71ee4d[m prevent dialog if first scene urls match
[33m9de39fb[m first scene load working
[33m5cd974b[m added url column to notes. first load url saves to db
[33mff8cf43[m removed meta data for notes table
[33mf43e58a[m updated sort function in utils
[33m306e831[m modal popup on timeout if user lodas scene on first note
[33mb3c34d8[m added sort function to sort actions into  order on load
[33m7172660[m added modal alert to layout
[33mf510d7e[m updated layout template
[33m322aa5b[m scene selection panel added allows scene update easily
[33m33faad5[m next previous action working on back and front end views
[33mb0a148b[m fixed bug actions not loaded on first note on first load
[33m3146226[m delete button added to timeline
[33m913258c[m delete actions when note deleted in db
[33mb06abf1[m actions loading working from database
[33m28e06a5[m added tracking variabale for actions, autosave on nav working
[33m133c6fb[m fixed bug scenestate json parsed from string
[33m45e3e36[m actions data saved to database in save method
[33mc024a5e[m clear actions function updated
[33m9db4a63[m actions sequence stored locally in app
[33mafbc0ec[m delete function working stable backend and frontend
[33m74817ed[m delete note function working on frontend
[33m62b2764[m fixed bug dynamic element listenrs not working
[33mc9042c6[m added function for generating uid. pre refactor
[33m5eb6c23[m added delete function, not functional yet
[33me9973e1[m added delete note function
[33mce02c54[m hyperlink to note title in timeline added
[33mf47ea19[m code cleanup complete
[33me5fb6ff[m updated edit note method fixed bug
[33m6575528[m fixed bug in saving notes, async causing issue. save notes on navigate if changes made
[33m78cdbb8[m updated layout template. new set active notes method created
[33mea09e15[m added scroll to top animation when edit is clicked
[33mda52be4[m edit note basic functio implemented
[33m6483ac3[m added hover and cursor animation to timeline actions
[33m00cb5b7[m added labels to indicate basic note properties in notes container
[33mf8c374b[m basic reset actions functionality implmented
[33m21899d6[m actions badge updates num actions
[33mcc6ed17[m updated toolbar style
[33m8c3d3dd[m updated notes layout toolbar
[33mbc178ab[m timeline UI update on add new or save
[33me5654d5[m added item templates method on load
[33m224c486[m add new section method
[33mc595186[m updated save method
[33md6b8fa5[m updated notes model to update notes global object array when new note added
[33m3589287[m note objects created properly on app load
[33m6d495ea[m added loadnotes method to load all notes from database into js
[33mbf72c1a[m note loading and editing basic functionality
[33m7989611[m note sections dynamically generated
[33m8544de6[m updated layout files to include new db structure
[33m72716eb[m updated database structure. new table for actions created on plugin activation
[33md2efe1a[m added basic add notes section
[33mf96c9c3[m id generated for each note item
[33m9c61899[m removed loadnotes ajax function from js, moved to php template
[33m0a264cf[m ajax function for saving notes rewritten
[33m972e29d[m note item included in layout file dynamically generates title and text
[33m04b466b[m single template file for 3d tours layout
[33ma14c03d[m added templates file
[33m6659218[m data dynamically inserted into php templates
[33md4b3d87[m rearranged hooks and functions. enqueue called after theme scripts fired
[33meb8b7e3[m added global variable for item and layout templates
[33m738b53d[m added new template function to generate php templates. loading for public notes working
[33m7c94565[m added item template for note section
[33m11774ef[m moved action status box to bottom, added utility method to update status
[33ma1bd9d1[m removed toolbar from ui
[33m99edd57[m added timeline container to template
[33m20432f1[m added saving status to view and added utility save status method
[33m62f0df1[m added utils class and loading spinner
[33m44492bb[m changed action item text
[33m4be127d[m added action dropdown
[33m40e6a12[m actions working with camera movement dissection, selection and different modes
[33mf374a66[m added new model class for note and new globals class. generic action created as test
[33mb9f84ce[m basic actions functionality working
[33me323fd9[m added reset button to toolbar
[33ma830a6f[m added anatomy scanner component to public view
[33mdbf7487[m logged out user view enabled
[33mcce91c9[m state of model saved and restored
[33md6b6417[m added load notes function
[33ma3977d2[m refactored save update notes function
[33md13cbe0[m notes saving basic functionality
[33mc06e764[m refactored wpaz to wp_az. tables created in daatabase on plugin acivtaion
[33m6385a39[m ajax submit form to server to save post
[33ma24dd4d[m only show tours layout on 3d-tours post type
[33mefb910e[m initial commit
