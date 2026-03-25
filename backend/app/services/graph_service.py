import networkx as nx


class GraphService:
    """NetworkX graph builder for telecom link analysis."""

    @staticmethod
    def build_graph_from_links(links):
        graph = nx.Graph()

        for link in links:
            caller = link.get("caller")
            receiver = link.get("receiver")
            if not caller or not receiver:
                continue
            graph.add_node(caller)
            graph.add_node(receiver)
            if graph.has_edge(caller, receiver):
                graph[caller][receiver]["weight"] += 1
            else:
                graph.add_edge(caller, receiver, weight=1)

        nodes = [{"id": node} for node in graph.nodes()]
        edges = [
            {
                "source": source,
                "target": target,
                "weight": data.get("weight", 1),
            }
            for source, target, data in graph.edges(data=True)
        ]

        return {"nodes": nodes, "edges": edges}
