import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/testimonials")
public class TestimonialServlet extends HttpServlet {

    // ── GET: return all testimonials as HTML cards ────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String sql = "SELECT id, name, city, state, review, rating " +
                     "FROM testimonials ORDER BY created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                String name   = rs.getString("name");
                String city   = rs.getString("city");
                String state  = rs.getString("state");
                String review = rs.getString("review");
                int    rating = rs.getInt("rating");

                StringBuilder stars = new StringBuilder();
                for (int i = 0; i < rating; i++) stars.append("★");

                out.println("<div class='col'>");
                out.println("  <div class='card h-100 testimonal-card shadow-sm p-4'>");
                out.println("    <div class='card-body text-start d-flex flex-column'>");
                out.println("      <div class='stars mb-3'>" + stars + "</div>");
                out.println("      <p class='card-text fst-italic flex-grow-1'>\"" + review + "\"</p>");
                out.println("      <div class='mt-4'>");
                out.println("        <h6 class='mb-0 fw-bold'>" + name + "</h6>");
                out.println("        <small class='text-muted'>" + city + ", " + state + "</small>");
                out.println("      </div>");
                out.println("    </div>");
                out.println("  </div>");
                out.println("</div>");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            out.println("<p class='text-danger'>Error loading testimonials: " + e.getMessage() + "</p>");
        }
    }

    // ── POST: save a new testimonial ──────────────────────────────────────
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String name   = request.getParameter("name");
        String city   = request.getParameter("city");
        String state  = request.getParameter("state");
        String review = request.getParameter("review");
        String rating = request.getParameter("rating");
        

        // Parse rating to integer explicitly
        int ratingInt;
        try {
            ratingInt = Integer.parseInt(rating);
        } catch (NumberFormatException e) {
            response.getWriter().println("Error: invalid rating value.");
            return;
        }

        // Use PreparedStatement to avoid all SQL issues
        String sql = "INSERT INTO testimonials (name, city, state, review, rating) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, city);
            ps.setString(3, state);
            ps.setString(4, review);
            ps.setInt(5, ratingInt);

            int rows = ps.executeUpdate();
            response.getWriter().println(rows > 0 ? "Testimonial saved!" : "Insert failed.");

        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().println("Error saving testimonial: " + e.getMessage());
        }
    }
}