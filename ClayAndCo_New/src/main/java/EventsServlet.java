import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/events")
public class EventsServlet extends HttpServlet {

    // GET - load all events
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();
        StringBuilder json = new StringBuilder("[");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM events");
            ResultSet rs = ps.executeQuery();
            boolean first = true;
            while (rs.next()) {
                if (!first) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"name\":\"").append(rs.getString("name")).append("\",")
                    .append("\"dayOfMonth\":").append(rs.getInt("day_of_month")).append(",")
                    .append("\"description\":\"").append(rs.getString("description")).append("\"")
                    .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        json.append("]");
        out.print(json.toString());
    }

    // POST - create new event (admin only)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.setStatus(403);
            out.print("Unauthorized");
            return;
        }

        String name = request.getParameter("eventName");
        int day     = Integer.parseInt(request.getParameter("eventDay"));
        String desc = request.getParameter("eventDesc");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO events (name, day_of_month, description) VALUES (?,?,?)");
            ps.setString(1, name);
            ps.setInt(2, day);
            ps.setString(3, desc);
            ps.executeUpdate();
            out.print("Event created successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            out.print("Error: " + e.getMessage());
        }
    }

    // DELETE - delete event by id (admin only)
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.setStatus(403);
            out.print("Unauthorized");
            return;
        }

        String idParam = request.getParameter("id");
        if (idParam == null) {
            response.setStatus(400);
            out.print("Missing event id");
            return;
        }

        int id = Integer.parseInt(idParam);

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "DELETE FROM events WHERE id = ?");
            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                out.print("Event deleted successfully");
            } else {
                out.print("Event not found");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.print("Error: " + e.getMessage());
        }
    }
}