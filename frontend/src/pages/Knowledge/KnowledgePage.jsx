import { useEffect, useState } from "react";
import api from "../../api/api";

function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/Knowledge", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setKnowledgeList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Knowledge Listesi</h1>

      <hr />

      {knowledgeList.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{item.question}</h3>

          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default KnowledgePage;