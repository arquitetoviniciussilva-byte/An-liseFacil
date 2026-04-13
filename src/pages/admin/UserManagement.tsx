.update({ status, role } as { status: UserProfile['status']; role: UserProfile['role']; })
      .eq('id', userId);