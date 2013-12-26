package game.manager.bean;

import javax.persistence.Id;
import javax.persistence.Table;


@Table
public class User {
	
	@Id
	private int id;
	private String userName;
	private String passWorld;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassWorld() {
		return passWorld;
	}
	public void setPassWorld(String passWorld) {
		this.passWorld = passWorld;
	}
	
	
}
