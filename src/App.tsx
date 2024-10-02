import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [challenges, setChallenges] = useState<Array<Schema["Challenge"]["type"]>>([]);

  useEffect(() => {
    client.models.Challenge.observeQuery().subscribe({
      next: (data) => setChallenges([...data.items]),
    });
  }, []);

  function createChallenge() {
    client.models.Challenge.create({ name: window.prompt("Challenge content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createChallenge}>+ new</button>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>{challenge.name}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
