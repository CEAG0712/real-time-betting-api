sequenceDiagram
    participant C as Client (SSR Frontend)
    participant SSR as SSR Handler (getServerSideProps)
    participant G as API Gateway
    participant E as Express API (App Service)
    participant R as Redis (Validation)
    participant D as Postgres DB (Ledger)
    participant PUB as Redis Pub/Sub
    participant SUB as Redis Subscriber (Payout Engine)

    C->>SSR: Request initial game state
    SSR->>G: Forward SSR request
    G->>E: GET /game-state
    E-->>SSR: JSON payload (hydration)
    SSR-->>C: Rendered HTML

    C->>G: POST /api/bet
    G->>E: Bet payload
    E->>R: Validate via TTL + dedup
    R-->>E: Valid or rejected
    alt Valid
        E->>D: Write to bet_ledger
        D-->>E: ACK
        E->>PUB: Emit "bet:placed"
        PUB->>SUB: Deliver message
        E-->>C: Return accepted response
    else Rejected
        E-->>C: Return rejection reason
    end
sequenceDiagram
    participant C as Client (SSR Frontend)
    participant SSR as SSR Handler (getServerSideProps)
    participant G as API Gateway
    participant E as Express API (App Service)
    participant R as Redis (Validation)
    participant D as Postgres DB (Ledger)
    participant PUB as Redis Pub/Sub
    participant SUB as Redis Subscriber (Payout Engine)

    C->>SSR: Request initial game state
    SSR->>G: Forward SSR request
    G->>E: GET /game-state
    E-->>SSR: JSON payload (hydration)
    SSR-->>C: Rendered HTML

    C->>G: POST /api/bet
    G->>E: Bet payload
    E->>R: Validate via TTL + dedup
    R-->>E: Valid or rejected
    alt Valid
        E->>D: Write to bet_ledger
        D-->>E: ACK
        E->>PUB: Emit "bet:placed"
        PUB->>SUB: Deliver message
        E-->>C: Return accepted response
    else Rejected
        E-->>C: Return rejection reason
    end
sequenceDiagram
    participant C as Client (SSR Frontend)
    participant SSR as SSR Handler (getServerSideProps)
    participant G as API Gateway
    participant E as Express API (App Service)
    participant R as Redis (Validation)
    participant D as Postgres DB (Ledger)
    participant PUB as Redis Pub/Sub
    participant SUB as Redis Subscriber (Payout Engine)

    C->>SSR: Request initial game state
    SSR->>G: Forward SSR request
    G->>E: GET /game-state
    E-->>SSR: JSON payload (hydration)
    SSR-->>C: Rendered HTML

    C->>G: POST /api/bet
    G->>E: Bet payload
    E->>R: Validate via TTL + dedup
    R-->>E: Valid or rejected
    alt Valid
        E->>D: Write to bet_ledger
        D-->>E: ACK
        E->>PUB: Emit "bet:placed"
        PUB->>SUB: Deliver message
        E-->>C: Return accepted response
    else Rejected
        E-->>C: Return rejection reason
    end
