import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/getRecord')
      .then(response => response.json())
      .then(data => {
        setData(data.data);
      });
  }, []);

  return (
    <div>{data.user_name}</div>
  );
}
