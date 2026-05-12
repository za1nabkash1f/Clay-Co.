public class User {

    private int    id;
    private String email;
    private String password;
    private String role;

    public User() {}

    public User(int id, String email, String password, String role) {
        this.id       = id;
        this.email    = email;
        this.password = password;
        this.role     = role;
    }

    // Getters
    public int    getId()       { return id; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public String getRole()     { return role; }

    // Setters
    public void setId(int id)             { this.id       = id; }
    public void setEmail(String email)    { this.email    = email; }
    public void setPassword(String pass)  { this.password = pass; }
    public void setRole(String role)      { this.role     = role; }
}
