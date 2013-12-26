package game.manager.dao;

import java.util.List;

public interface IBaseDao<T> {
	public void save(T bean);
	public void delete(T bean);
	public void deleteAll(List<T> bean);
	public void update(T bean);
	public T findById(Integer id);
	public List<T> findAll();
	public void deleteById(Integer id);
	public T findByUserId(String beanId);
	public void deleteByUserId(String beanId);
}
