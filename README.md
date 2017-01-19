# PeopleSoft Project Explorer
## What this is
PS Project Explorer is an interactive explorer for PeopleSoft AppDesigner projects. There is no official way to examine these files outside of migrating them into the database, committing the changes. This webapp allows you to drag in a project and view its contents before its changes are committed to the database.

## How it works:
### Note: this requires a modern browser such as Chrome or Firefox.
Simply drag in the .XML file generated from AppDesigner when the project is saved to a file. Do not drag in the .ini or the folder itself. All items will be displayed in the list and is clickable. Red text means there is an in-depth view available.

While it does allow the user to see all elements in the project, it gives in-depth details about the items with red text. These items include:

- Images
- HTML
- Style Sheets
- Portal Regustry Structures
- Application Package PeopleCode
- Record PeopleCode
- Page PeopleCode
- Component PeopleCode
- Component Record PeopleCode
- Component Record Field PeopleCode
- SQL