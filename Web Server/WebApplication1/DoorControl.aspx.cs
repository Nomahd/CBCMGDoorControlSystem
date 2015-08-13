using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System.Xml;


namespace WebApplication1
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(Server.MapPath("config.xml"));
            XmlNodeList folderList = xmlDoc.GetElementsByTagName("folder");
            XmlNodeList statusList = xmlDoc.GetElementsByTagName("status");

            String ID = Request.QueryString["ID"];
            String req = Request.QueryString["request"];
            String name = Request.QueryString["name"];
            String sessionKey = Request.QueryString["sessionKey"];
            String rights = Request.QueryString["rights"];
            String language = Request.QueryString["language"];


            String filePath = folderList[0].InnerXml;
            String statusPath = statusList[0].InnerXml;
            String fileName = null;
            DateTime time = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second);
            String timeFormated = String.Format("{0:yyyyMMdd-HHmmss}", time);
            String fileContent = req + "\r\n" + name + "\r\n" + timeFormated + "\r\n";


            using (SqlConnection connection = new SqlConnection("user id=doorapp;" +
                                "password=da2014;" +
                                "server=localhost;" +
                                "database=DOOR; " +
                                "connection timeout=30"))
            {
                connection.Open();

                if (ID == "00")
                {
                    SqlParameter sessionParam0 = new SqlParameter("@session", SqlDbType.VarChar, 50);
                    sessionParam0.Value = sessionKey;
                    SqlParameter requestParam0 = new SqlParameter("@request", SqlDbType.VarChar, 50);
                    requestParam0.Value = req;

                    SqlCommand log = new SqlCommand("INSERT INTO CBCMGDOOR_LOG (SESSION_KEY, REQUEST) VALUES (@session, @request)", connection);

                    log.Parameters.Add(requestParam0);
                    log.Parameters.Add(sessionParam0);

                    log.ExecuteNonQuery();
                    fileName = timeFormated + " " + name;

                    StreamWriter file = new StreamWriter(filePath + fileName + @".txt");
                    
                    file.Write(fileContent);
                    file.Close();
                    

                }
                else if (ID == "01")
                {

                    SqlDataReader reader = null;
                    SqlParameter nameParam1 = new SqlParameter("@name", SqlDbType.VarChar, 30);
                    nameParam1.Value = name;
                    SqlCommand check = new SqlCommand("SELECT * FROM CBCMGDOOR_USERRIGHTS WHERE USERNAME = @name", connection);
                    check.Parameters.Add(nameParam1);
                    reader = check.ExecuteReader();
                    while (reader.Read())
                    {
                        Response.Write(reader["RIGHTS"].ToString());
                    }
                    reader.Close();
                }

                else if (ID == "02")
                {

                    SqlParameter nameParam2 = new SqlParameter("@name", SqlDbType.VarChar, 30);
                    nameParam2.Value = name;

                    SqlParameter rightsParam2 = new SqlParameter("@rights", SqlDbType.VarChar, 5);
                    rightsParam2.Value = rights;

                    SqlParameter sessionParam2 = new SqlParameter("@sessionKey", SqlDbType.VarChar, 32);
                    sessionParam2.Value = sessionKey;

                    SqlCommand insert = new SqlCommand("INSERT INTO CBCMGDOOR_USERS (SESSION_KEY, USERNAME, RIGHTS) VALUES (@sessionKey, @name, @rights)", connection);

                    insert.Parameters.Add(nameParam2);
                    insert.Parameters.Add(rightsParam2);
                    insert.Parameters.Add(sessionParam2);

                    insert.ExecuteNonQuery();

                }
                else if (ID == "03")
                {
                    String status = System.IO.File.ReadAllText(statusPath);
                    Response.Write(status);
                }

                else if (ID == "04")
                {
                    SqlDataReader reader = null;

                    SqlParameter sessionParam4 = new SqlParameter("@session", SqlDbType.VarChar, 32);
                    sessionParam4.Value = sessionKey;
                    SqlCommand check = new SqlCommand("SELECT * FROM CBCMGDOOR_USERS WHERE SESSION_KEY = @session", connection);

                    check.Parameters.Add(sessionParam4);


                    reader = check.ExecuteReader();

                    while (reader.Read())
                    {
                        if (reader["SESSION_KEY"].ToString() == sessionKey)
                        {
                            Response.Write(reader["SESSION_KEY"].ToString());
                        }
                    }
                    reader.Close();
                }
                else if (ID == "05")
                {
                    SqlParameter sessionParam5 = new SqlParameter("@session", SqlDbType.VarChar, 32);
                    sessionParam5.Value = sessionKey;

                    SqlCommand remove = new SqlCommand("DELETE FROM CBCMGDOOR_USERS WHERE SESSION_KEY = @session", connection);
                    remove.Parameters.Add(sessionParam5);

                    remove.ExecuteNonQuery();

                }
                else if (ID == "06")
                {
                    SqlDataReader reader = null;

                    String json = null;
                    SqlParameter langParam = new SqlParameter("@lang", SqlDbType.VarChar, 8);
                    langParam.Value = language;
                    SqlCommand  getLanguage = new SqlCommand("SELECT [KEY],VALUE FROM CBCMGDOOR_MESSAGE WHERE LANGUAGE = @lang", connection);
                    getLanguage.Parameters.Add(langParam);
                    reader = getLanguage.ExecuteReader();
                    while(reader.Read())
                    {
                        json = json + ("{"+ reader["KEY"].ToString() + ": '" + reader["VALUE"].ToString() + "'}$");
                    }
                    reader.Close();
                    Response.Write(json);
                    
                    
                }
                else if (ID == "07")
                {
                    SqlDataReader reader = null;

                    SqlParameter sessionParam7 = new SqlParameter("@session", SqlDbType.VarChar, 32);
                    sessionParam7.Value = sessionKey;

                    SqlCommand check = new SqlCommand("SELECT * FROM CBCMGDOOR_USERS WHERE SESSION_KEY = @session" , connection);
                    check.Parameters.Add(sessionParam7);

                    reader = check.ExecuteReader();
                    while (reader.Read())
                    {
                        if (reader["SESSION_KEY"].ToString() == sessionKey)
                        {
                            Response.Write(reader["SESSION_KEY"].ToString());

                        }
                    }
                    reader.Close();
                }
                else if (ID == "08")
                {
                    SqlDataReader reader = null;

                    SqlParameter rightsParam8 = new SqlParameter("@rights", SqlDbType.VarChar, 5);
                    rightsParam8.Value = rights;

                    SqlCommand ip = new SqlCommand("SELECT IP FROM CBCMGDOOR_IP WHERE RIGHTS = @rights", connection);
                    ip.Parameters.Add(rightsParam8);

                    reader = ip.ExecuteReader();
                    while (reader.Read())
                    {
                        Response.Write(reader["IP"].ToString());
                    }
                    reader.Close();
                }
                try
                {
                    connection.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }     
        }
    }
}