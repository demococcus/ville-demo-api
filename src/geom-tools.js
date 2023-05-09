function countVertices(geom) {
    if (geom && geom.type == "Polygon" && geom.coordinates && geom.coordinates[0]) {
        return geom.coordinates[0].length    
    }
    return 0
}

function centroid(geom) {
    if (geom && geom.type == "Polygon" && geom.coordinates && geom.coordinates[0]) {
        
        const polygon = geom

        // Extract the polygon's vertices from the GeoJSON coordinates
        const vertices = polygon.coordinates[0].map(([x, y]) => ({ x, y }));

        // Calculate the polygon's area using the shoelace formula
        let area = 0;
        for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[i].y * vertices[j].x;
        }
        area /= 2;

        // Calculate the polygon's centroid using the weighted average of the vertices
        let x_sum = 0;
        let y_sum = 0;
        for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        const cross_product = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
        x_sum += (vertices[i].x + vertices[j].x) * cross_product;
        y_sum += (vertices[i].y + vertices[j].y) * cross_product;
        }
        const centroid_x = x_sum / (6 * area);
        const centroid_y = y_sum / (6 * area);

        // return the coordinates of the centroid        
        return [centroid_x, centroid_y]
    }
    
    return null
}

  module.exports = {
    countVertices,
    centroid
  };