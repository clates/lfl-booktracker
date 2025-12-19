# BookTracker Test Cases

This document outlines manual test scenarios to verify the core functionality of the BookTracker application "Where's George for little libraries".

## 1. User Navigation & Home Page

**Goal**: Verify that the application loads correctly and the user can navigate to key areas.

| Step | Action                               | Expected Result                                                            |
| ---- | ------------------------------------ | -------------------------------------------------------------------------- |
| 1.1  | Open the application homepage (`/`). | Page loads with "BookTracker" title, a Search input, and a Navigation bar. |
| 1.2  | Verify navigation links.             | "Search" and "Generate Code" links are present in the header.              |
| 1.3  | Click "Generate Code".               | User is navigated to `/generate` URL.                                      |
| 1.4  | Click "Search" (or logo).            | User is navigated back to `/` URL.                                         |

## 2. Book Registration (Generate Code)

**Goal**: Verify a user can register a new book and receive a tracking code.

**Pre-requisites**: User is on the `/generate` page.

| Step | Action                                                                         | Expected Result                                                                                                        |
| ---- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 2.1  | **Search Implementation**: Type a known book title (e.g., "The Great Gatsby"). | Dropdown appears with search results from Open Library.                                                                |
| 2.2  | **Selection**: Select a book from the dropdown.                                | "Selected Book" card appears showing Title, Author, and Cover image (if available).                                    |
| 2.3  | **Geolocation**: Allow browser location access if prompted.                    | Application silently captures latitude/longitude (check console or network tab if debugging, user sees no error).      |
| 2.4  | **Generate**: Click "Generate Code".                                           | A success toast appears ("Hit recorded successfully"). A unique 9-character code is displayed in format `XXX-XXX-XXX`. |
| 2.5  | **Persistence**: Note the generated code for the next test.                    | Code is visible and clearly readable.                                                                                  |

## 3. Book Tracking (Search)

**Goal**: Verify a user can find a registered book using its unique code.

**Pre-requisites**: User is on the `/` (Search) page. A valid book code exists (from Test 2).

| Step | Action                                                                                    | Expected Result                                                                                                        |
| ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 3.1  | **Invalid Search**: Enter an invalid code (e.g., `ZZZ-ZZZ-ZZZ`) and click "Search".       | Error toast appears: "Failed to fetch book data" / "Book not found".                                                   |
| 3.2  | **Valid Search**: Enter the valid code from Test 2 (case-insensitive) and click "Search". | Loading state appears briefly. Book details (Title, Author, Location) are displayed below the search bar.              |
| 3.3  | **History**: Check "Recent Sightings" table.                                              | At least one sighting (the registration event) is listed with "Current Location" (or specific location) and timestamp. |

## 4. Record a Sighting

**Goal**: Verify a user can record finding a book.

**Pre-requisites**: User has successfully searched for a book (Test 3.2).

| Step | Action                                             | Expected Result                                                                                |
| ---- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 4.1  | Click "Record Hit" button on the Book Result card. | Button disables briefly (loading). Success toast appears.                                      |
| 4.2  | Verify Update.                                     | The "Recent Sightings" table updates to include a new row for the current sighting at the top. |
