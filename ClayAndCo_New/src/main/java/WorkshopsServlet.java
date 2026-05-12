import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/workshops")
public class WorkshopsServlet extends HttpServlet {

    // GET - load all workshops
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();
        StringBuilder json = new StringBuilder("[");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM workshops";
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            boolean first = true;
            while (rs.next()) {
                if (!first) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"name\":\"").append(rs.getString("name")).append("\",")
                    .append("\"date\":\"").append(rs.getString("date")).append("\",")
                    .append("\"duration\":").append(rs.getInt("duration")).append(",")
                    .append("\"availableSpots\":").append(rs.getInt("available_spots")).append(",")
                    .append("\"description\":\"").append(rs.getString("description")).append("\",")
                    .append("\"price\":").append(rs.getDouble("price")).append(",")
                    .append("\"level\":\"").append(rs.getString("level")).append("\",")
                    .append("\"image\":\"").append(rs.getString("image")).append("\"")
                    .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        json.append("]");
        out.print(json.toString());
    }

    // POST - create new workshop (admin only)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();

        // Session guard — admin only
        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.setStatus(403);
            out.print("Unauthorized");
            return;
        }

        String name     = request.getParameter("workshopName");
        String date     = request.getParameter("workshopDate");
        int duration    = Integer.parseInt(request.getParameter("workshopDuration"));
        int spots       = Integer.parseInt(request.getParameter("availableSpots"));
        String desc     = request.getParameter("workshopDesc");
        double price    = Double.parseDouble(request.getParameter("workshopPrice"));
        String level    = request.getParameter("level");
        String image    = request.getParameter("image");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO workshops (name, date, duration, available_spots, description, price, level, image) VALUES (?,?,?,?,?,?,?,?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, name);
            ps.setString(2, date);
            ps.setInt(3, duration);
            ps.setInt(4, spots);
            ps.setString(5, desc);
            ps.setDouble(6, price);
            ps.setString(7, level);
            ps.setString(8, image);
            ps.executeUpdate();
            out.print("Workshop created successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            out.print("Error: " + e.getMessage());
        }
    }
}