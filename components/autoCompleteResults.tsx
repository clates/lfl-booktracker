import { OpenLibraryDoc } from "@/lib/openLibrary";
import { X } from "lucide-react";
import React from "react";

type AutoCompleteResultsProps = {
  results: OpenLibraryDoc[];
  onClick: (book: OpenLibraryDoc) => void;
};

const rowHeight = 50;

const AutoCompleteResults: React.FC<AutoCompleteResultsProps> = ({
  results,
  onClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        gap: "1px",
        maxHeight: `${rowHeight * 4.5}px`,
        overflow: "scroll",
      }}
    >
      {results.map((book, index) => (
        <div
          onClick={() => onClick(book)}
          key={book.isbn ? book.isbn[0] : index}
          style={{
            width: "600px",
            minHeight: `${rowHeight}px`,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 50%), url(https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200px",
            backgroundPositionX: "right",
            backgroundPositionY: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "start",
              padding: "16px",
            }}
          >
            <h3
              style={{
                color: "#222",
                fontSize: "16px",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              {book.title}
            </h3>
            <p style={{ fontSize: "14px", margin: "0", color: "#555" }}>
              {book.author_name?.join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoCompleteResults;
