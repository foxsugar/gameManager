package game.manager.dao;


import game.manager.bean.User;

public interface UserDao extends IBaseDao<User>{
	public User findByUserId(String id);
}
