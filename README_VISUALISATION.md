                    Your Dash app
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
   Legend system    Zoom system       Export system
        │                │                 │
        │                │                 │
        ▼                ▼                 ▼
 drag/resize         wheel zoom        PNG capture
        │                │                 │
        ▼                ▼                 ▼
 localStorage       Cytoscape          cy.png()
                         │                 │
                         │             html2canvas
                         │                 │
                         └────────┬────────┘
                                  ▼
                             final PNG
                                  │
                                  ▼
                              Dash data