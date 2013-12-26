package game.manager.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginAction {
	
	@RequestMapping(value="/MyProject/login")
	public String login(HttpSession session,HttpServletResponse response,HttpServletRequest request){
		
		
		System.out.println("hello world");
		return "/login";
		
	}
}
