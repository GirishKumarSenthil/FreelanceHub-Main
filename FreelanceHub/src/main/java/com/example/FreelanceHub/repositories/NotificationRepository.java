package com.example.FreelanceHub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.FreelanceHub.models.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.createdAt DESC LIMIT 10")
    List<Notification> findByUserId(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM notifications " +
            "WHERE user_id = :userId " +
            "AND id NOT IN (" +
            "  SELECT id FROM (" +
            "    SELECT id FROM notifications " +
            "    WHERE user_id = :userId" +
            "    ORDER BY created_at DESC LIMIT 10" +
            "  ) AS recent_notifications" +
            ")", nativeQuery = true)
    void deleteOldNotifications(@Param("userId") String userId);
}
