package game.manager.dao;


import org.springframework.stereotype.Component;

import game.manager.bean.User;


public interface UserDao extends IBaseDao<User>{
	public User findByUserId(String id);
}
