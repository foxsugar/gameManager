package game.manager.dao;

import java.util.List;

import org.hibernate.Session;
import org.springframework.stereotype.Component;

import game.manager.bean.User;
import game.manager.support.MyHibernateDaoSupport;

@Component
public class UserDaoImpl extends MyHibernateDaoSupport implements UserDao{

	@Override
	public void save(User bean) {
		System.out.println("====");
		// TODO Auto-generated method stub
		Session session  = getSession();
		session.save(bean);
		
		
		
	}

	@Override
	public void delete(User bean) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAll(List<User> bean) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(User bean) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public User findById(Integer id) {
		return null;
	}

	@Override
	public List<User> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteByUserId(String beanId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public User findByUserId(String id) {
		// TODO Auto-generated method stub
		return null;
	}

}
