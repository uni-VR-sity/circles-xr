# Server Managment

<br>

## Users

Users can create accounts on the server to access the worlds. Each account has a username, user type, password, email, display name, and avatar associated with it. Depending on the user type and granted permissions, users have access to different content on the server. 

There are 5 avaliable user categories with their associated user types:

| User Category | User Type                     |
| :---          | :---                          |
| Admin User    | Superuser, Admin              |
| Manager User  | Teacher, Researcher           |
| Standard User | Student, Participant, Tester  |
| Guest         | Guest                         |
| Magic Guest   | Magic Guest                   |

<br>

The following are the permissions each user category has:

<table>
    <tr>
        <th></th>
        <th>Admin</th>
        <th>Manager</th>
        <th>Standard</th>
        <th>Guest</th>
        <th>Magic Guest</th>
    </tr>
    <tr>
        <th align="left" colspan=6>Worlds</th>
    </tr>
    <tr>
        <td>View public worlds</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
    </tr>
    <tr>
        <td>View private worlds</td>
        <td align="center">✅</td>
        <td align="center">With permission</td>
        <td align="center">With permission</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>View magic link worlds</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">✅</td>
    </tr>
    <tr>
        <td>Edit world settings</td>
        <td align="center">✅</td>
        <td align="center">With permission</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Create groups/ subgroups</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Organize worlds into groups/ subgroups</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Create magic links</td>
        <td align="center">✅</td>
        <td align="center">With permission</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <th align="left" colspan=6>Users</th>
    </tr>
    <tr>
        <td>Create users</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Change user’s user type</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Edit user profile</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">Only avatar</td>
        <td align="center">Only avatar</td>
    </tr>
    <tr>
        <th align="left" colspan=6>Files</th>
    </tr>
    <tr>
        <td>Upload files</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
    <tr>
        <td>Add files to whiteboard</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">✅</td>
        <td align="center">❌</td>
        <td align="center">❌</td>
    </tr>
</table>

<br>

## World Settings

To access the world settings, click on the ⚙️ icon next to the world name. On this page, you can:
- Indicate whether the world is 🔓 public or 🔒 private
- Give certain users permission to view worlds and edit world settings
- Specify world group and subgroup

<br>

## Magic Links

Magic links are JSON Web Tokens (JWT) that automatically log users into the framework as magic guest users, giving them access to:
- Public circles
- Circles associated with the magic link

Magic links can be created on the Explore page. Users can see the magic links they made on the Your Magic Links page, where they can renew or delete them.