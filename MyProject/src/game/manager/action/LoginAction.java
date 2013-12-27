package game.manager.action;

import game.manager.bean.User;
import game.manager.dao.UserDao;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginAction {
	
	@Autowired
	UserDao userDao;

	@RequestMapping(value="login")
	public String login(){
		
		User user = new User();
		user.setUserName("hello");
		user.setPassWord("12");
		userDao.save(user);
		
		
		System.out.println("hello world");
		return "jsp/test";
		
	}
}
